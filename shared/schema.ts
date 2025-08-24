import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ip: text("ip").notNull(),
  status: text("status").notNull(), // "active", "disconnected", "pending"
  lastSeen: timestamp("last_seen"),
  version: text("version"),
  os: text("os"),
  platform: text("platform"),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  agentName: text("agent_name").notNull(),
  rule: text("rule").notNull(),
  severity: text("severity").notNull(), // "critical", "high", "medium", "low"
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  mitreAttack: jsonb("mitre_attack"), // Array of MITRE ATT&CK technique IDs
  resolved: boolean("resolved").default(false),
});

export const vulnerabilities = pgTable("vulnerabilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  agentName: text("agent_name").notNull(),
  cve: text("cve").notNull(),
  severity: text("severity").notNull(), // "critical", "high", "medium", "low"
  title: text("title").notNull(),
  description: text("description"),
  package: text("package"),
  version: text("version"),
  detectedAt: timestamp("detected_at").defaultNow(),
  status: text("status").default("open"), // "open", "fixed", "ignored"
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const complianceResults = pgTable("compliance_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  framework: text("framework").notNull(), // "PCI_DSS", "GDPR", "HIPAA", "NIST_800_53"
  requirement: text("requirement").notNull(),
  status: text("status").notNull(), // "pass", "fail", "not_applicable"
  agentId: varchar("agent_id").references(() => agents.id),
  agentName: text("agent_name"),
  description: text("description"),
  lastChecked: timestamp("last_checked").defaultNow(),
});

export const mitreAttackData = pgTable("mitre_attack_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  techniqueId: text("technique_id").notNull(),
  techniqueName: text("technique_name").notNull(),
  tactic: text("tactic").notNull(),
  description: text("description"),
  alertCount: integer("alert_count").default(0),
  lastSeen: timestamp("last_seen"),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  lastSeen: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).omit({
  id: true,
  detectedAt: true,
});

export const insertComplianceResultSchema = createInsertSchema(complianceResults).omit({
  id: true,
  lastChecked: true,
});

export const insertMitreAttackSchema = createInsertSchema(mitreAttackData).omit({
  id: true,
  lastSeen: true,
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Vulnerability = typeof vulnerabilities.$inferSelect;
export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type ComplianceResult = typeof complianceResults.$inferSelect;
export type InsertComplianceResult = z.infer<typeof insertComplianceResultSchema>;
export type MitreAttackData = typeof mitreAttackData.$inferSelect;
export type InsertMitreAttack = z.infer<typeof insertMitreAttackSchema>;

// Dashboard metrics types
export type DashboardMetrics = {
  activeAgents: number;
  criticalAlerts: number;
  vulnerabilities: number;
  complianceScore: number;
};

export type AgentStatusCounts = {
  active: number;
  disconnected: number;
  pending: number;
};

export type ComplianceFrameworkScore = {
  framework: string;
  score: number;
  total: number;
  percentage: number;
};

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
