import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  cityProjects, 
  buildings, 
  llmTasks, 
  communicationLogs,
  InsertCityProject,
  InsertBuilding,
  InsertLlmTask,
  InsertCommunicationLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// City Projects
export async function createCityProject(project: InsertCityProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cityProjects).values(project);
  
  // Drizzle returns array: [{ insertId, affectedRows, ... }, null]
  const insertId = (result as any)[0]?.insertId;
  return { insertId: Number(insertId) };
}

export async function getCityProjectsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cityProjects).where(eq(cityProjects.userId, userId)).orderBy(desc(cityProjects.createdAt));
}

export async function getCityProjectById(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(cityProjects).where(eq(cityProjects.id, projectId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCityProjectStatus(projectId: number, status: string, currentStep?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cityProjects).set({ status: status as any, currentStep }).where(eq(cityProjects.id, projectId));
}

// Buildings
export async function createBuilding(building: InsertBuilding) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(buildings).values(building);
  const insertId = (result as any)[0]?.insertId;
  return { insertId: Number(insertId) };
}

export async function getBuildingsByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(buildings).where(eq(buildings.projectId, projectId));
}

// LLM Tasks
export async function createLlmTask(task: InsertLlmTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(llmTasks).values(task);
  const insertId = (result as any)[0]?.insertId;
  return { insertId: Number(insertId) };
}

export async function getLlmTasksByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(llmTasks).where(eq(llmTasks.projectId, projectId)).orderBy(desc(llmTasks.createdAt));
}

export async function updateLlmTaskStatus(taskId: number, status: string, output?: string, codeGenerated?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status: status as any };
  if (status === "in_progress") {
    updateData.startedAt = new Date();
  } else if (status === "completed" || status === "failed") {
    updateData.completedAt = new Date();
  }
  if (output) updateData.output = output;
  if (codeGenerated) updateData.codeGenerated = codeGenerated;

  await db.update(llmTasks).set(updateData).where(eq(llmTasks.id, taskId));
}

// Communication Logs
export async function createCommunicationLog(log: InsertCommunicationLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(communicationLogs).values(log);
  const insertId = (result as any)[0]?.insertId;
  return { insertId: Number(insertId) };
}

export async function getCommunicationLogsByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(communicationLogs).where(eq(communicationLogs.projectId, projectId)).orderBy(desc(communicationLogs.timestamp));
}

