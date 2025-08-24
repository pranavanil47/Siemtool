import { 
  type Agent, 
  type InsertAgent,
  type Alert,
  type InsertAlert,
  type Vulnerability,
  type InsertVulnerability,
  type ComplianceResult,
  type InsertComplianceResult,
  type MitreAttackData,
  type InsertMitreAttack,
  type DashboardMetrics,
  type AgentStatusCounts,
  type ComplianceFrameworkScore,
  type User,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users, agents, alerts, vulnerabilities, complianceResults, mitreAttackData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Agent methods
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, agent: Partial<Agent>): Promise<Agent | undefined>;
  getAgentStatusCounts(): Promise<AgentStatusCounts>;
  getRecentAgentActivity(): Promise<Agent[]>;

  // Alert methods
  getAlerts(filters?: { search?: string; page?: number; limit?: number }): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlertsTimeline(): Promise<any[]>;

  // Vulnerability methods
  getVulnerabilities(): Promise<Vulnerability[]>;
  getVulnerability(id: string): Promise<Vulnerability | undefined>;
  createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability>;
  getVulnerabilityDistribution(): Promise<any[]>;

  // Compliance methods
  getComplianceResults(): Promise<ComplianceResult[]>;
  createComplianceResult(result: InsertComplianceResult): Promise<ComplianceResult>;
  getComplianceOverview(): Promise<ComplianceFrameworkScore[]>;

  // MITRE ATT&CK methods
  getMitreAttackData(): Promise<MitreAttackData[]>;
  createMitreAttackData(data: InsertMitreAttack): Promise<MitreAttackData>;

  // Dashboard methods
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private agents: Map<string, Agent> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private vulnerabilities: Map<string, Vulnerability> = new Map();
  private complianceResults: Map<string, ComplianceResult> = new Map();
  private mitreAttackData: Map<string, MitreAttackData> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with empty data - will be populated by API
  }

  // Agent methods
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { 
      ...insertAgent, 
      id,
      lastSeen: new Date(),
      version: insertAgent.version || null,
      os: insertAgent.os || null,
      platform: insertAgent.platform || null
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    const updatedAgent = { ...agent, ...updates };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async getAgentStatusCounts(): Promise<AgentStatusCounts> {
    const agents = Array.from(this.agents.values());
    return {
      active: agents.filter(a => a.status === 'active').length,
      disconnected: agents.filter(a => a.status === 'disconnected').length,
      pending: agents.filter(a => a.status === 'pending').length,
    };
  }

  async getRecentAgentActivity(): Promise<Agent[]> {
    const agents = Array.from(this.agents.values());
    return agents
      .sort((a, b) => (b.lastSeen?.getTime() || 0) - (a.lastSeen?.getTime() || 0))
      .slice(0, 5);
  }

  // Alert methods
  async getAlerts(filters?: { search?: string; page?: number; limit?: number }): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      alerts = alerts.filter(alert => 
        alert.rule.toLowerCase().includes(search) ||
        alert.agentName.toLowerCase().includes(search) ||
        alert.description.toLowerCase().includes(search)
      );
    }

    // Sort by timestamp (newest first)
    alerts.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));

    // Apply pagination
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      alerts = alerts.slice(start, start + filters.limit);
    }

    return alerts;
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id,
      timestamp: new Date(),
      agentId: insertAlert.agentId || null,
      mitreAttack: insertAlert.mitreAttack || null,
      resolved: insertAlert.resolved || null
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async getAlertsTimeline(): Promise<any[]> {
    // Generate timeline data for charts
    const now = new Date();
    const hours = [];
    
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
      const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      const alerts = Array.from(this.alerts.values()).filter(alert => {
        const alertTime = alert.timestamp || new Date();
        return alertTime >= new Date(time.getTime() - 4 * 60 * 60 * 1000) && 
               alertTime < new Date(time.getTime() + 4 * 60 * 60 * 1000);
      });

      hours.push({
        time: timeStr,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length,
      });
    }
    
    return hours;
  }

  // Vulnerability methods
  async getVulnerabilities(): Promise<Vulnerability[]> {
    return Array.from(this.vulnerabilities.values());
  }

  async getVulnerability(id: string): Promise<Vulnerability | undefined> {
    return this.vulnerabilities.get(id);
  }

  async createVulnerability(insertVulnerability: InsertVulnerability): Promise<Vulnerability> {
    const id = randomUUID();
    const vulnerability: Vulnerability = { 
      ...insertVulnerability, 
      id,
      detectedAt: new Date(),
      status: insertVulnerability.status || null,
      version: insertVulnerability.version || null,
      agentId: insertVulnerability.agentId || null,
      description: insertVulnerability.description || null,
      package: insertVulnerability.package || null
    };
    this.vulnerabilities.set(id, vulnerability);
    return vulnerability;
  }

  async getVulnerabilityDistribution(): Promise<any[]> {
    const vulns = Array.from(this.vulnerabilities.values());
    return [
      { name: 'Critical', value: vulns.filter(v => v.severity === 'critical').length, color: '#EF4444' },
      { name: 'High', value: vulns.filter(v => v.severity === 'high').length, color: '#F59E0B' },
      { name: 'Medium', value: vulns.filter(v => v.severity === 'medium').length, color: '#FCD34D' },
      { name: 'Low', value: vulns.filter(v => v.severity === 'low').length, color: '#10B981' },
    ];
  }

  // Compliance methods
  async getComplianceResults(): Promise<ComplianceResult[]> {
    return Array.from(this.complianceResults.values());
  }

  async createComplianceResult(insertResult: InsertComplianceResult): Promise<ComplianceResult> {
    const id = randomUUID();
    const result: ComplianceResult = { 
      ...insertResult, 
      id,
      lastChecked: new Date(),
      agentId: insertResult.agentId || null,
      agentName: insertResult.agentName || null,
      description: insertResult.description || null
    };
    this.complianceResults.set(id, result);
    return result;
  }

  async getComplianceOverview(): Promise<ComplianceFrameworkScore[]> {
    const results = Array.from(this.complianceResults.values());
    const frameworks = ['PCI_DSS', 'GDPR', 'HIPAA', 'NIST_800_53'];
    
    return frameworks.map(framework => {
      const frameworkResults = results.filter(r => r.framework === framework);
      const passed = frameworkResults.filter(r => r.status === 'pass').length;
      const total = frameworkResults.length || 1; // Avoid division by zero
      const percentage = Math.round((passed / total) * 100);
      
      return {
        framework,
        score: passed,
        total,
        percentage
      };
    });
  }

  // MITRE ATT&CK methods
  async getMitreAttackData(): Promise<MitreAttackData[]> {
    return Array.from(this.mitreAttackData.values());
  }

  async createMitreAttackData(insertData: InsertMitreAttack): Promise<MitreAttackData> {
    const id = randomUUID();
    const data: MitreAttackData = { 
      ...insertData, 
      id,
      lastSeen: new Date(),
      description: insertData.description || null,
      alertCount: insertData.alertCount || null
    };
    this.mitreAttackData.set(id, data);
    return data;
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const agents = Array.from(this.agents.values());
    const alerts = Array.from(this.alerts.values());
    const vulnerabilities = Array.from(this.vulnerabilities.values());
    const complianceOverview = await this.getComplianceOverview();
    
    const avgCompliance = complianceOverview.reduce((sum, f) => sum + f.percentage, 0) / complianceOverview.length;

    return {
      activeAgents: agents.filter(a => a.status === 'active').length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
      vulnerabilities: vulnerabilities.length,
      complianceScore: Math.round(avgCompliance)
    };
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Agent methods - using database
  async getAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [newAgent] = await db.insert(agents).values(agent).returning();
    return newAgent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined> {
    const [updatedAgent] = await db
      .update(agents)
      .set(updates)
      .where(eq(agents.id, id))
      .returning();
    return updatedAgent;
  }

  async getAgentStatusCounts(): Promise<AgentStatusCounts> {
    const allAgents = await db.select().from(agents);
    return {
      active: allAgents.filter(a => a.status === 'active').length,
      disconnected: allAgents.filter(a => a.status === 'disconnected').length,
      pending: allAgents.filter(a => a.status === 'pending').length,
    };
  }

  async getRecentAgentActivity(): Promise<Agent[]> {
    return await db.select().from(agents).limit(5);
  }

  // Alert methods - using database
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts);
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async getAlertsTimeline(): Promise<any[]> {
    // Generate mock timeline data for now
    const now = new Date();
    const hours = [];
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
      const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      hours.push({
        time: timeStr,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      });
    }
    return hours;
  }

  // Vulnerability methods - using database
  async getVulnerabilities(): Promise<Vulnerability[]> {
    return await db.select().from(vulnerabilities);
  }

  async getVulnerability(id: string): Promise<Vulnerability | undefined> {
    const [vuln] = await db.select().from(vulnerabilities).where(eq(vulnerabilities.id, id));
    return vuln;
  }

  async createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability> {
    const [newVuln] = await db.insert(vulnerabilities).values(vulnerability).returning();
    return newVuln;
  }

  async getVulnerabilityDistribution(): Promise<any[]> {
    const vulns = await db.select().from(vulnerabilities);
    return [
      { name: 'Critical', value: vulns.filter(v => v.severity === 'critical').length, color: '#EF4444' },
      { name: 'High', value: vulns.filter(v => v.severity === 'high').length, color: '#F59E0B' },
      { name: 'Medium', value: vulns.filter(v => v.severity === 'medium').length, color: '#FCD34D' },
      { name: 'Low', value: vulns.filter(v => v.severity === 'low').length, color: '#10B981' },
    ];
  }

  // Compliance methods - using database
  async getComplianceResults(): Promise<ComplianceResult[]> {
    return await db.select().from(complianceResults);
  }

  async createComplianceResult(result: InsertComplianceResult): Promise<ComplianceResult> {
    const [newResult] = await db.insert(complianceResults).values(result).returning();
    return newResult;
  }

  async getComplianceOverview(): Promise<ComplianceFrameworkScore[]> {
    const results = await db.select().from(complianceResults);
    const frameworks = ['PCI_DSS', 'GDPR', 'HIPAA', 'NIST_800_53'];
    
    return frameworks.map(framework => {
      const frameworkResults = results.filter(r => r.framework === framework);
      const passed = frameworkResults.filter(r => r.status === 'pass').length;
      const total = frameworkResults.length || 1;
      const percentage = Math.round((passed / total) * 100);
      
      return {
        framework,
        score: passed,
        total,
        percentage
      };
    });
  }

  // MITRE ATT&CK methods - using database
  async getMitreAttackData(): Promise<MitreAttackData[]> {
    return await db.select().from(mitreAttackData);
  }

  async createMitreAttackData(data: InsertMitreAttack): Promise<MitreAttackData> {
    const [newData] = await db.insert(mitreAttackData).values(data).returning();
    return newData;
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [allAgents, allAlerts, allVulns] = await Promise.all([
      db.select().from(agents),
      db.select().from(alerts),
      db.select().from(vulnerabilities)
    ]);
    
    const complianceOverview = await this.getComplianceOverview();
    const avgCompliance = complianceOverview.reduce((sum, f) => sum + f.percentage, 0) / complianceOverview.length;

    return {
      activeAgents: allAgents.filter(a => a.status === 'active').length,
      criticalAlerts: allAlerts.filter(a => a.severity === 'critical').length,
      vulnerabilities: allVulns.length,
      complianceScore: Math.round(avgCompliance)
    };
  }
}

export const storage = new DatabaseStorage();
