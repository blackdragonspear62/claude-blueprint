import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createCityProject,
  getCityProjectsByUserId,
  getCityProjectById,
  getBuildingsByProjectId,
  getLlmTasksByProjectId,
  getCommunicationLogsByProjectId,
} from "./db";
import { LLMOrchestrator } from "./llmOrchestrator";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  city: router({
    // Create a new city project
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        prompt: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Use user ID if authenticated, otherwise use 0 for anonymous
        const userId = ctx.user?.id || 0;
        
        const result = await createCityProject({
          userId,
          name: input.name,
          prompt: input.prompt,
          status: "pending",
        });

        // Extract insertId from the result
        const projectId = result.insertId;

        if (!projectId || isNaN(projectId)) {
          throw new Error("Failed to create project: invalid project ID");
        }

        return {
          success: true,
          projectId,
        };
      }),

    // Start building process
    startBuilding: publicProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await getCityProjectById(input.projectId);
        
        if (!project) {
          throw new Error("Project not found");
        }

        // Only check authorization if user is authenticated
        if (ctx.user && project.userId !== ctx.user.id && project.userId !== 0) {
          throw new Error("Unauthorized");
        }

        // Start orchestration in background
        console.log(`[Router] Starting orchestration for project ${input.projectId}`);
        const orchestrator = new LLMOrchestrator(input.projectId);
        
        // Don't await - let it run in background
        setImmediate(() => {
          orchestrator.processPrompt(project.prompt).catch(error => {
            console.error("[Router] Orchestration error:", error);
          });
        });

        return {
          success: true,
          message: "Building process started",
        };
      }),

    // Get user's projects
    list: protectedProcedure
      .query(async ({ ctx }) => {
        const projects = await getCityProjectsByUserId(ctx.user.id);
        return projects;
      }),

    // Get project details
    getProject: publicProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const project = await getCityProjectById(input.projectId);
        
        if (!project) {
          throw new Error("Project not found");
        }

        // Only check authorization if user is authenticated and project is not anonymous
        if (ctx.user && project.userId !== ctx.user.id && project.userId !== 0) {
          throw new Error("Unauthorized");
        }

        return project;
      }),

    // Get buildings for a project
    getBuildings: publicProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const project = await getCityProjectById(input.projectId);
        
        if (!project) {
          throw new Error("Project not found");
        }

        // Only check authorization if user is authenticated and project is not anonymous
        if (ctx.user && project.userId !== ctx.user.id && project.userId !== 0) {
          throw new Error("Unauthorized");
        }

        const buildings = await getBuildingsByProjectId(input.projectId);
        return buildings;
      }),

    // Get LLM tasks for a project
    getTasks: publicProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const project = await getCityProjectById(input.projectId);
        
        if (!project) {
          throw new Error("Project not found");
        }

        // Only check authorization if user is authenticated and project is not anonymous
        if (ctx.user && project.userId !== ctx.user.id && project.userId !== 0) {
          throw new Error("Unauthorized");
        }

        const tasks = await getLlmTasksByProjectId(input.projectId);
        return tasks;
      }),

    // Get communication logs for a project
    getLogs: publicProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const project = await getCityProjectById(input.projectId);
        
        if (!project) {
          throw new Error("Project not found");
        }

        // Only check authorization if user is authenticated and project is not anonymous
        if (ctx.user && project.userId !== ctx.user.id && project.userId !== 0) {
          throw new Error("Unauthorized");
        }

        const logs = await getCommunicationLogsByProjectId(input.projectId);
        return logs;
      }),

    // Generate debate summary using AI
    generateDebateSummary: publicProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await getCityProjectById(input.projectId);
        
        if (!project) {
          throw new Error("Project not found");
        }

        // Only check authorization if user is authenticated and project is not anonymous
        if (ctx.user && project.userId !== ctx.user.id && project.userId !== 0) {
          throw new Error("Unauthorized");
        }

        const logs = await getCommunicationLogsByProjectId(input.projectId);
        
        if (logs.length === 0) {
          return {
            keyArguments: [],
            agreements: [],
            disagreements: [],
            conclusion: "No debate data available yet.",
          };
        }

        // Create a summary of the debate using LLM
        const debateText = logs.map(log => 
          `${log.fromLlm} to ${log.toLlm}: ${log.message}`
        ).join("\n");

        const summaryPrompt = `Analyze this AI team debate and provide a structured summary:

${debateText}

Provide a JSON response with this structure:
{
  "keyArguments": [{"llm": "LLM name", "argument": "main point"}],
  "agreements": ["point of agreement"],
  "disagreements": ["point of discussion or debate"],
  "conclusion": "final consensus reached by the team"
}

Focus on technical decisions, architecture choices, and implementation strategies.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert at analyzing technical discussions. Always respond with valid JSON only." },
            { role: "user", content: summaryPrompt }
          ]
        });

        const content = response.choices[0].message.content as string;
        
        try {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                           content.match(/(\{[\s\S]*\})/);
          const jsonStr = jsonMatch ? jsonMatch[1] : content;
          const summary = JSON.parse(jsonStr);
          
          return summary;
        } catch (e) {
          console.error("Failed to parse summary:", e);
          return {
            keyArguments: [],
            agreements: [],
            disagreements: [],
            conclusion: "Failed to generate summary.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

