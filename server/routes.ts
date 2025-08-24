import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAlertSchema, insertAgentSchema, insertVulnerabilitySchema, insertComplianceResultSchema, insertMitreAttackSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User management routes (admin only)
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      // This would typically check admin permissions
      res.json({ message: "User management endpoint" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  // Public/protected routes
  // Dashboard metrics endpoint
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Agent endpoints - protected
  app.get("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/status", async (req, res) => {
    try {
      const statusCounts = await storage.getAgentStatusCounts();
      res.json(statusCounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent status" });
    }
  });

  app.get("/api/agents/recent", async (req, res) => {
    try {
      const recentActivity = await storage.getRecentAgentActivity();
      res.json(recentActivity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent agent activity" });
    }
  });

  app.post("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validatedData);
      res.status(201).json(agent);
    } catch (error) {
      res.status(400).json({ message: "Invalid agent data" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  // Alert endpoints - protected
  app.get("/api/alerts", isAuthenticated, async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const filters = {
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };
      const alerts = await storage.getAlerts(filters);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/timeline", async (req, res) => {
    try {
      const timeline = await storage.getAlertsTimeline();
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts timeline" });
    }
  });

  app.post("/api/alerts", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.get("/api/alerts/:id", async (req, res) => {
    try {
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });

  // Vulnerability endpoints - protected
  app.get("/api/vulnerabilities", isAuthenticated, async (req, res) => {
    try {
      const vulnerabilities = await storage.getVulnerabilities();
      res.json(vulnerabilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vulnerabilities" });
    }
  });

  app.get("/api/vulnerabilities/distribution", async (req, res) => {
    try {
      const distribution = await storage.getVulnerabilityDistribution();
      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vulnerability distribution" });
    }
  });

  app.post("/api/vulnerabilities", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVulnerabilitySchema.parse(req.body);
      const vulnerability = await storage.createVulnerability(validatedData);
      res.status(201).json(vulnerability);
    } catch (error) {
      res.status(400).json({ message: "Invalid vulnerability data" });
    }
  });

  app.get("/api/vulnerabilities/:id", async (req, res) => {
    try {
      const vulnerability = await storage.getVulnerability(req.params.id);
      if (!vulnerability) {
        return res.status(404).json({ message: "Vulnerability not found" });
      }
      res.json(vulnerability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vulnerability" });
    }
  });

  // Compliance endpoints - protected
  app.get("/api/compliance", isAuthenticated, async (req, res) => {
    try {
      const results = await storage.getComplianceResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance results" });
    }
  });

  app.get("/api/compliance/overview", async (req, res) => {
    try {
      const overview = await storage.getComplianceOverview();
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance overview" });
    }
  });

  app.post("/api/compliance", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertComplianceResultSchema.parse(req.body);
      const result = await storage.createComplianceResult(validatedData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid compliance data" });
    }
  });

  // MITRE ATT&CK endpoints - protected
  app.get("/api/mitre-attack", isAuthenticated, async (req, res) => {
    try {
      const mitreData = await storage.getMitreAttackData();
      res.json(mitreData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch MITRE ATT&CK data" });
    }
  });

  app.post("/api/mitre-attack", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMitreAttackSchema.parse(req.body);
      const mitreData = await storage.createMitreAttackData(validatedData);
      res.status(201).json(mitreData);
    } catch (error) {
      res.status(400).json({ message: "Invalid MITRE ATT&CK data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
