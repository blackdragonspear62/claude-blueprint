import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * City projects created by users
 */
export const cityProjects = mysqlTable("city_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]).default("pending").notNull(),
  currentStep: varchar("currentStep", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CityProject = typeof cityProjects.$inferSelect;
export type InsertCityProject = typeof cityProjects.$inferInsert;

/**
 * Buildings in the 3D city
 */
export const buildings = mysqlTable("buildings", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // office, park, residential, etc
  positionX: int("positionX").notNull(),
  positionY: int("positionY").notNull(),
  positionZ: int("positionZ").notNull(),
  width: int("width").notNull(),
  height: int("height").notNull(),
  depth: int("depth").notNull(),
  color: varchar("color", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = typeof buildings.$inferInsert;

/**
 * LLM tasks and their execution logs
 */
export const llmTasks = mysqlTable("llm_tasks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  llmRole: mysqlEnum("llmRole", ["architect", "frontend", "backend", "database", "qa"]).notNull(),
  llmModel: varchar("llmModel", { length: 100 }).notNull(), // GPT-4, Claude, etc
  taskDescription: text("taskDescription").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]).default("pending").notNull(),
  input: text("input"),
  output: text("output"),
  codeGenerated: text("codeGenerated"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LlmTask = typeof llmTasks.$inferSelect;
export type InsertLlmTask = typeof llmTasks.$inferInsert;

/**
 * Communication logs between LLMs
 */
export const communicationLogs = mysqlTable("communication_logs", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  fromLlm: varchar("fromLlm", { length: 100 }).notNull(),
  toLlm: varchar("toLlm", { length: 100 }).notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type CommunicationLog = typeof communicationLogs.$inferSelect;
export type InsertCommunicationLog = typeof communicationLogs.$inferInsert;

