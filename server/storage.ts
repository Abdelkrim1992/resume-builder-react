import {
  users,
  resumes,
  coverLetters,
  templates,
  resumeScores,
  resumeJdMatches,
  type User,
  type InsertUser,
  type Resume,
  type InsertResume,
  type CoverLetter,
  type InsertCoverLetter,
  type Template,
  type InsertTemplate,
  type ResumeScore,
  type InsertResumeScore,
  type ResumeJdMatch,
  type InsertResumeJdMatch
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume operations
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUserId(userId: number): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<boolean>;
  
  // Cover Letter operations
  getCoverLetter(id: number): Promise<CoverLetter | undefined>;
  getCoverLettersByUserId(userId: number): Promise<CoverLetter[]>;
  createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
  updateCoverLetter(id: number, coverLetter: Partial<InsertCoverLetter>): Promise<CoverLetter | undefined>;
  deleteCoverLetter(id: number): Promise<boolean>;
  
  // Template operations
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByPremiumStatus(isPremium: boolean): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Resume Score operations
  getResumeScore(id: number): Promise<ResumeScore | undefined>;
  getResumeScoreByResumeId(resumeId: number): Promise<ResumeScore | undefined>;
  createResumeScore(resumeScore: InsertResumeScore): Promise<ResumeScore>;
  
  // Resume JD Match operations
  getResumeJdMatch(id: number): Promise<ResumeJdMatch | undefined>;
  getResumeJdMatchesByResumeId(resumeId: number): Promise<ResumeJdMatch[]>;
  createResumeJdMatch(resumeJdMatch: InsertResumeJdMatch): Promise<ResumeJdMatch>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private coverLetters: Map<number, CoverLetter>;
  private templates: Map<number, Template>;
  private resumeScores: Map<number, ResumeScore>;
  private resumeJdMatches: Map<number, ResumeJdMatch>;
  
  private userId = 1;
  private resumeId = 1;
  private coverLetterId = 1;
  private templateId = 1;
  private resumeScoreId = 1;
  private resumeJdMatchId = 1;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.coverLetters = new Map();
    this.templates = new Map();
    this.resumeScores = new Map();
    this.resumeJdMatches = new Map();
    
    // Initialize with sample templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: InsertTemplate[] = [
      {
        name: "Modern Professional",
        description: "A clean, modern design suitable for most industries.",
        previewImage: "modern_professional.svg",
        structure: { sections: ["header", "summary", "experience", "education", "skills"] },
        isPremium: false
      },
      {
        name: "Creative Minimal",
        description: "Perfect for creative industries and design roles.",
        previewImage: "creative_minimal.svg",
        structure: { sections: ["header", "portfolio", "experience", "skills", "education"] },
        isPremium: true
      },
      {
        name: "Executive Classic",
        description: "Traditional design perfect for executive and management roles.",
        previewImage: "executive_classic.svg",
        structure: { sections: ["header", "summary", "experience", "achievements", "education", "skills"] },
        isPremium: true
      }
    ];
    
    templates.forEach(template => this.createTemplate(template));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume operations
  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.resumeId++;
    const now = new Date();
    const resume: Resume = { 
      ...insertResume, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, updateData: Partial<InsertResume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;
    
    const updated: Resume = { 
      ...resume, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
  }

  // Cover Letter operations
  async getCoverLetter(id: number): Promise<CoverLetter | undefined> {
    return this.coverLetters.get(id);
  }

  async getCoverLettersByUserId(userId: number): Promise<CoverLetter[]> {
    return Array.from(this.coverLetters.values()).filter(
      (coverLetter) => coverLetter.userId === userId
    );
  }

  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const id = this.coverLetterId++;
    const now = new Date();
    const coverLetter: CoverLetter = { 
      ...insertCoverLetter, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.coverLetters.set(id, coverLetter);
    return coverLetter;
  }

  async updateCoverLetter(id: number, updateData: Partial<InsertCoverLetter>): Promise<CoverLetter | undefined> {
    const coverLetter = this.coverLetters.get(id);
    if (!coverLetter) return undefined;
    
    const updated: CoverLetter = { 
      ...coverLetter, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.coverLetters.set(id, updated);
    return updated;
  }

  async deleteCoverLetter(id: number): Promise<boolean> {
    return this.coverLetters.delete(id);
  }

  // Template operations
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByPremiumStatus(isPremium: boolean): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.isPremium === isPremium
    );
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateId++;
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  // Resume Score operations
  async getResumeScore(id: number): Promise<ResumeScore | undefined> {
    return this.resumeScores.get(id);
  }

  async getResumeScoreByResumeId(resumeId: number): Promise<ResumeScore | undefined> {
    return Array.from(this.resumeScores.values()).find(
      (score) => score.resumeId === resumeId
    );
  }

  async createResumeScore(insertResumeScore: InsertResumeScore): Promise<ResumeScore> {
    const id = this.resumeScoreId++;
    const resumeScore: ResumeScore = { 
      ...insertResumeScore, 
      id, 
      createdAt: new Date() 
    };
    this.resumeScores.set(id, resumeScore);
    return resumeScore;
  }

  // Resume JD Match operations
  async getResumeJdMatch(id: number): Promise<ResumeJdMatch | undefined> {
    return this.resumeJdMatches.get(id);
  }

  async getResumeJdMatchesByResumeId(resumeId: number): Promise<ResumeJdMatch[]> {
    return Array.from(this.resumeJdMatches.values()).filter(
      (match) => match.resumeId === resumeId
    );
  }

  async createResumeJdMatch(insertResumeJdMatch: InsertResumeJdMatch): Promise<ResumeJdMatch> {
    const id = this.resumeJdMatchId++;
    const resumeJdMatch: ResumeJdMatch = { 
      ...insertResumeJdMatch, 
      id, 
      createdAt: new Date() 
    };
    this.resumeJdMatches.set(id, resumeJdMatch);
    return resumeJdMatch;
  }
}

export const storage = new MemStorage();
