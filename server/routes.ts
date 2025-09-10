import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizAssessmentSchema } from "@shared/schema";
import * as schema from "@shared/schema";
import { getCareerSuggestions } from "./openai";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize static data
  await storage.initializeStaticData();

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const userId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Career paths routes
  app.get('/api/careers', async (req, res) => {
    try {
      const careers = await storage.getAllCareerPaths();
      res.json(careers);
    } catch (error) {
      console.error("Error fetching careers:", error);
      res.status(500).json({ message: "Failed to fetch careers" });
    }
  });

  app.get('/api/careers/:id', async (req, res) => {
    try {
      const career = await storage.getCareerPath(req.params.id);
      if (!career) {
        return res.status(404).json({ message: "Career path not found" });
      }
      res.json(career);
    } catch (error) {
      console.error("Error fetching career:", error);
      res.status(500).json({ message: "Failed to fetch career" });
    }
  });

  // Quiz routes
  app.post('/api/quiz/submit', async (req: any, res) => {
    try {
      console.log("Received quiz submission request body:", req.body);
      const userId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder
      // Check if user exists, if not, create them
      const userList = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      let user = userList[0]; // get first user if exists

      if (!user) {
        // Assuming a basic user creation for testing purposes
        await db.insert(schema.users).values({
          id: userId,
          email: `user-${userId}@example.com`,
          firstName: 'Test',
          lastName: 'User',
        });
      }
      const validatedData = insertQuizAssessmentSchema.parse({
        userId,
        responses: req.body.responses,
        results: req.body.results
      });

      const assessment = await storage.saveQuizAssessment(validatedData);
      
      // Save career matches if provided
      if (req.body.careerMatches && req.body.careerMatches.length > 0) {
        const matches = req.body.careerMatches.map((match: any) => ({
          userId,
          careerPathId: match.careerPathId,
          matchPercentage: match.matchPercentage,
          assessmentId: assessment.id
        }));
        await storage.saveUserCareerMatches(matches);
        console.log("Calling saveUserCareerMatches with:", matches);
      }

      res.json(assessment);
    } catch (error) {
      console.error("Error saving quiz assessment:", error);
      res.status(500).json({ message: "Failed to save assessment" });
    }
  });

  app.post('/api/analyze', async (req, res) => {
    try {
      const { responses } = req.body;
      const suggestions = await getCareerSuggestions(responses);
      res.json(suggestions);
    } catch (error) {
      console.error("Error analyzing quiz:", error);
      res.status(500).json({ message: "Failed to analyze quiz" });
    }
  });

  app.get('/api/quiz/results', async (req: any, res) => {
    try {
      const userId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder
      const matches = await storage.getUserCareerMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Colleges routes
  app.get('/api/colleges', async (req, res) => {
    try {
      const { stream, search } = req.query;
      
      let colleges;
      if (search) {
        colleges = await storage.searchColleges(search as string);
      } else {
        colleges = await storage.getCollegesByStream(stream as string);
      }
      
      res.json(colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}