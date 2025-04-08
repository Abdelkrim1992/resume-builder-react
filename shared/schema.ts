import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  planType: text("plan_type").default("free"),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  templateId: text("template_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coverLetters = pgTable("cover_letters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  jobDescription: text("job_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  previewImage: text("preview_image"),
  structure: jsonb("structure").notNull(),
  isPremium: boolean("is_premium").default(false),
});

export const resumeScores = pgTable("resume_scores", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  score: integer("score").notNull(),
  feedback: jsonb("feedback").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resumeJdMatches = pgTable("resume_jd_matches", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").notNull(),
  jobDescription: text("job_description").notNull(),
  matchScore: integer("match_score").notNull(),
  missingKeywords: jsonb("missing_keywords"),
  suggestions: jsonb("suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  planType: true,
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  userId: true,
  title: true,
  content: true,
  templateId: true,
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).pick({
  userId: true,
  title: true,
  content: true,
  jobDescription: true,
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  description: true,
  previewImage: true,
  structure: true,
  isPremium: true,
});

export const insertResumeScoreSchema = createInsertSchema(resumeScores).pick({
  resumeId: true,
  score: true,
  feedback: true,
});

export const insertResumeJdMatchSchema = createInsertSchema(resumeJdMatches).pick({
  resumeId: true,
  jobDescription: true,
  matchScore: true,
  missingKeywords: true,
  suggestions: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertResumeScore = z.infer<typeof insertResumeScoreSchema>;
export type ResumeScore = typeof resumeScores.$inferSelect;

export type InsertResumeJdMatch = z.infer<typeof insertResumeJdMatchSchema>;
export type ResumeJdMatch = typeof resumeJdMatches.$inferSelect;
