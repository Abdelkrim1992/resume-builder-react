import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertResumeSchema, 
  insertCoverLetterSchema,
  insertResumeScoreSchema,
  insertResumeJdMatchSchema
} from "@shared/schema";

// Extended schemas with validation
const createUserSchema = insertUserSchema.extend({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const resumeScoreRequestSchema = z.object({
  resumeId: z.number(),
});

const jdMatchRequestSchema = z.object({
  resumeId: z.number(),
  jobDescription: z.string().min(50),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Auth Routes
  router.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = createUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      if (user.password !== loginData.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Templates Routes
  router.get("/templates", async (_req: Request, res: Response) => {
    try {
      const templates = await storage.getAllTemplates();
      return res.status(200).json(templates);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/templates/free", async (_req: Request, res: Response) => {
    try {
      const templates = await storage.getTemplatesByPremiumStatus(false);
      return res.status(200).json(templates);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/templates/premium", async (_req: Request, res: Response) => {
    try {
      const templates = await storage.getTemplatesByPremiumStatus(true);
      return res.status(200).json(templates);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resume Routes
  router.post("/resumes", async (req: Request, res: Response) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      
      const resume = await storage.createResume(resumeData);
      return res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/resumes/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const resumes = await storage.getResumesByUserId(userId);
      return res.status(200).json(resumes);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/resumes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }
      
      const resume = await storage.getResume(id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      return res.status(200).json(resume);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/resumes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }
      
      const resumeData = insertResumeSchema.partial().parse(req.body);
      const updated = await storage.updateResume(id, resumeData);
      
      if (!updated) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      return res.status(200).json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/resumes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }
      
      const deleted = await storage.deleteResume(id);
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cover Letter Routes
  router.post("/cover-letters", async (req: Request, res: Response) => {
    try {
      const coverLetterData = insertCoverLetterSchema.parse(req.body);
      
      const coverLetter = await storage.createCoverLetter(coverLetterData);
      return res.status(201).json(coverLetter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/cover-letters/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const coverLetters = await storage.getCoverLettersByUserId(userId);
      return res.status(200).json(coverLetters);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/cover-letters/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cover letter ID" });
      }
      
      const coverLetter = await storage.getCoverLetter(id);
      if (!coverLetter) {
        return res.status(404).json({ message: "Cover letter not found" });
      }
      
      return res.status(200).json(coverLetter);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put("/cover-letters/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cover letter ID" });
      }
      
      const coverLetterData = insertCoverLetterSchema.partial().parse(req.body);
      const updated = await storage.updateCoverLetter(id, coverLetterData);
      
      if (!updated) {
        return res.status(404).json({ message: "Cover letter not found" });
      }
      
      return res.status(200).json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/cover-letters/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cover letter ID" });
      }
      
      const deleted = await storage.deleteCoverLetter(id);
      if (!deleted) {
        return res.status(404).json({ message: "Cover letter not found" });
      }
      
      return res.status(200).json({ message: "Cover letter deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resume Score Routes
  router.post("/resume-score", async (req: Request, res: Response) => {
    try {
      const { resumeId } = resumeScoreRequestSchema.parse(req.body);
      
      // Check if resume exists
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Generate a score and feedback based on the resume content
      const score = Math.floor(Math.random() * 30) + 70; // Simulated score between 70-100
      
      const feedback = [
        { category: "Content", score: Math.floor(Math.random() * 10) + 1, suggestions: ["Add more quantifiable achievements", "Use action verbs"] },
        { category: "Format", score: Math.floor(Math.random() * 10) + 1, suggestions: ["Improve spacing", "Use consistent formatting"] },
        { category: "Keywords", score: Math.floor(Math.random() * 10) + 1, suggestions: ["Add industry-specific keywords", "Include technical skills"] }
      ];
      
      const resumeScore = await storage.createResumeScore({
        resumeId,
        score,
        feedback
      });
      
      return res.status(201).json(resumeScore);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/resume-score/:resumeId", async (req: Request, res: Response) => {
    try {
      const resumeId = parseInt(req.params.resumeId);
      if (isNaN(resumeId)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }
      
      const resumeScore = await storage.getResumeScoreByResumeId(resumeId);
      if (!resumeScore) {
        return res.status(404).json({ message: "Resume score not found" });
      }
      
      return res.status(200).json(resumeScore);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resume JD Match Routes
  router.post("/resume-jd-match", async (req: Request, res: Response) => {
    try {
      const { resumeId, jobDescription } = jdMatchRequestSchema.parse(req.body);
      
      // Check if resume exists
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Simulate matching analysis
      const matchScore = Math.floor(Math.random() * 40) + 60; // Between 60-100
      
      const missingKeywords = ["leadership", "project management", "agile", "teamwork"];
      const suggestions = [
        "Add more details about leadership experience",
        "Highlight project management methodologies",
        "Include examples of agile development",
        "Emphasize teamwork achievements"
      ];
      
      const jdMatch = await storage.createResumeJdMatch({
        resumeId,
        jobDescription,
        matchScore,
        missingKeywords,
        suggestions
      });
      
      return res.status(201).json(jdMatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/resume-jd-match/:resumeId", async (req: Request, res: Response) => {
    try {
      const resumeId = parseInt(req.params.resumeId);
      if (isNaN(resumeId)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }
      
      const matches = await storage.getResumeJdMatchesByResumeId(resumeId);
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Use the API router with prefix
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
