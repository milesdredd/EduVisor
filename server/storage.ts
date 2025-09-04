import {
  users,
  colleges,
  careerPaths,
  quizAssessments,
  userCareerMatches,
  type User,
  type UpsertUser,
  type College,
  type CareerPath,
  type InsertCareerPath,
  type InsertCollege,
  type QuizAssessment,
  type InsertQuizAssessment,
  type UserCareerMatch,
  type InsertUserCareerMatch,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Quiz operations
  saveQuizAssessment(assessment: InsertQuizAssessment): Promise<QuizAssessment>;
  getUserQuizAssessments(userId: string): Promise<QuizAssessment[]>;
  
  // Career operations
  getAllCareerPaths(): Promise<CareerPath[]>;
  getCareerPath(id: string): Promise<CareerPath | undefined>;
  saveUserCareerMatches(matches: InsertUserCareerMatch[]): Promise<void>;
  getUserCareerMatches(userId: string): Promise<(UserCareerMatch & { careerPath: CareerPath })[]>;
  
  // College operations
  getAllColleges(): Promise<College[]>;
  getCollegesByStream(stream?: string): Promise<College[]>;
  searchColleges(query: string): Promise<College[]>;
  
  // Initialize data
  initializeStaticData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
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

  // Quiz operations
  async saveQuizAssessment(assessment: InsertQuizAssessment): Promise<QuizAssessment> {
    const [result] = await db.insert(quizAssessments).values(assessment).returning();
    return result;
  }

  async getUserQuizAssessments(userId: string): Promise<QuizAssessment[]> {
    return await db
      .select()
      .from(quizAssessments)
      .where(eq(quizAssessments.userId, userId))
      .orderBy(desc(quizAssessments.completedAt));
  }

  // Career operations
  async getAllCareerPaths(): Promise<CareerPath[]> {
    return await db.select().from(careerPaths);
  }

  async getCareerPath(id: string): Promise<CareerPath | undefined> {
    const [career] = await db.select().from(careerPaths).where(eq(careerPaths.id, id));
    return career;
  }

  async saveUserCareerMatches(matches: InsertUserCareerMatch[]): Promise<void> {
    await db.insert(userCareerMatches).values(matches);
  }

  async getUserCareerMatches(userId: string): Promise<(UserCareerMatch & { careerPath: CareerPath })[]> {
    const results = await db
      .select({
        id: userCareerMatches.id,
        userId: userCareerMatches.userId,
        careerPathId: userCareerMatches.careerPathId,
        matchPercentage: userCareerMatches.matchPercentage,
        assessmentId: userCareerMatches.assessmentId,
        createdAt: userCareerMatches.createdAt,
        careerPath: careerPaths,
      })
      .from(userCareerMatches)
      .leftJoin(careerPaths, eq(userCareerMatches.careerPathId, careerPaths.id))
      .where(eq(userCareerMatches.userId, userId))
      .orderBy(desc(userCareerMatches.matchPercentage));
    
    // Filter out null career paths
    return results.filter(result => result.careerPath !== null) as (UserCareerMatch & { careerPath: CareerPath })[];
  }

  // College operations
  async getAllColleges(): Promise<College[]> {
    return await db.select().from(colleges).orderBy(asc(colleges.distance));
  }

  async getCollegesByStream(stream?: string): Promise<College[]> {
    if (!stream || stream === 'All Streams') {
      return this.getAllColleges();
    }
    return await db.select().from(colleges).orderBy(asc(colleges.distance));
  }

  async searchColleges(query: string): Promise<College[]> {
    // For now, return all colleges. In production, implement proper search
    return this.getAllColleges();
  }

  async initializeStaticData(): Promise<void> {
    // Check if data already exists
    const existingCareers = await db.select().from(careerPaths).limit(1);
    if (existingCareers.length > 0) return;

    // Initialize career paths
    const careers: InsertCareerPath[] = [
      {
        title: "Computer Science & IT",
        description: "Shape the future through technology. From software development to artificial intelligence, this field offers unlimited opportunities for innovation and growth.",
        averageSalaryMin: 800000,
        averageSalaryMax: 2000000,
        jobGrowthRate: 15,
        icon: "code",
        color: "blue",
        requiredSkills: [
          { name: "Programming Languages", importance: "High", proficiency: 90, description: "Java, Python, JavaScript, C++" },
          { name: "Problem Solving", importance: "High", proficiency: 85, description: "Algorithm design, debugging, optimization" },
          { name: "Mathematics", importance: "Medium", proficiency: 75, description: "Calculus, statistics, linear algebra" },
          { name: "Communication", importance: "Medium", proficiency: 70, description: "Technical writing, presentation skills" }
        ],
        jobOpportunities: [
          { title: "Software Engineer", company: "Google, Microsoft, Amazon", salary: "₹8-20 LPA", experience: "0-3 years" },
          { title: "Data Scientist", company: "Netflix, Uber, Flipkart", salary: "₹10-25 LPA", experience: "1-4 years" },
          { title: "Product Manager", company: "Zomato, Paytm, Swiggy", salary: "₹12-30 LPA", experience: "2-5 years" }
        ]
      },
      {
        title: "Engineering",
        description: "Mechanical, electrical, civil, and specialized engineering fields that build the world's infrastructure and technology.",
        averageSalaryMin: 600000,
        averageSalaryMax: 1500000,
        jobGrowthRate: 8,
        icon: "settings",
        color: "orange",
        requiredSkills: [
          { name: "Mathematics & Physics", importance: "High", proficiency: 85, description: "Advanced calculus, physics principles" },
          { name: "Technical Drawing", importance: "High", proficiency: 80, description: "CAD software, technical documentation" },
          { name: "Problem Solving", importance: "High", proficiency: 85, description: "Engineering analysis and design" }
        ],
        jobOpportunities: [
          { title: "Mechanical Engineer", company: "Tata Motors, L&T, BHEL", salary: "₹6-15 LPA", experience: "0-3 years" },
          { title: "Civil Engineer", company: "DLF, Godrej, PWD", salary: "₹5-12 LPA", experience: "0-3 years" },
          { title: "Electrical Engineer", company: "NTPC, PowerGrid, Siemens", salary: "₹7-16 LPA", experience: "0-3 years" }
        ]
      },
      {
        title: "Business & Management",
        description: "Lead teams, manage operations, and drive organizational success through strategic business planning.",
        averageSalaryMin: 500000,
        averageSalaryMax: 1200000,
        jobGrowthRate: 12,
        icon: "briefcase",
        color: "green",
        requiredSkills: [
          { name: "Leadership", importance: "High", proficiency: 80, description: "Team management and motivation" },
          { name: "Communication", importance: "High", proficiency: 85, description: "Public speaking, negotiation" },
          { name: "Strategic Thinking", importance: "High", proficiency: 75, description: "Business planning and analysis" }
        ],
        jobOpportunities: [
          { title: "Business Analyst", company: "Deloitte, EY, KPMG", salary: "₹5-12 LPA", experience: "0-2 years" },
          { title: "Marketing Manager", company: "Unilever, P&G, ITC", salary: "₹8-18 LPA", experience: "2-5 years" },
          { title: "Operations Manager", company: "Amazon, Flipkart, Reliance", salary: "₹10-20 LPA", experience: "3-6 years" }
        ]
      },
      {
        title: "Healthcare & Medicine",
        description: "Care for others and make a meaningful impact on people's lives through medical practice and healthcare.",
        averageSalaryMin: 400000,
        averageSalaryMax: 2000000,
        jobGrowthRate: 10,
        icon: "heart",
        color: "red",
        requiredSkills: [
          { name: "Medical Knowledge", importance: "High", proficiency: 90, description: "Anatomy, physiology, pathology" },
          { name: "Empathy", importance: "High", proficiency: 85, description: "Patient care and communication" },
          { name: "Critical Thinking", importance: "High", proficiency: 80, description: "Diagnosis and treatment planning" }
        ],
        jobOpportunities: [
          { title: "Doctor", company: "AIIMS, Apollo, Fortis", salary: "₹8-25 LPA", experience: "0-5 years" },
          { title: "Nurse", company: "Max Healthcare, Medanta", salary: "₹4-8 LPA", experience: "0-3 years" },
          { title: "Pharmacist", company: "Sun Pharma, Cipla, Dr. Reddy's", salary: "₹3-7 LPA", experience: "0-2 years" }
        ]
      },
      {
        title: "Education & Teaching",
        description: "Shape minds and inspire the next generation through teaching and mentoring in academic institutions.",
        averageSalaryMin: 300000,
        averageSalaryMax: 800000,
        jobGrowthRate: 6,
        icon: "book-open",
        color: "purple",
        requiredSkills: [
          { name: "Subject Expertise", importance: "High", proficiency: 85, description: "Deep knowledge in teaching subject" },
          { name: "Communication", importance: "High", proficiency: 90, description: "Clear explanation and presentation" },
          { name: "Patience", importance: "High", proficiency: 80, description: "Working with diverse learners" }
        ],
        jobOpportunities: [
          { title: "School Teacher", company: "Kendriya Vidyalaya, DPS", salary: "₹3-8 LPA", experience: "0-5 years" },
          { title: "College Professor", company: "Delhi University, JNU", salary: "₹6-15 LPA", experience: "3-8 years" },
          { title: "Education Consultant", company: "BYJU'S, Unacademy", salary: "₹4-10 LPA", experience: "1-4 years" }
        ]
      }
    ];

    await db.insert(careerPaths).values(careers);

    // Initialize colleges
    const collegeData: InsertCollege[] = [
      {
        name: "Indian Institute of Technology, Delhi",
        location: "New Delhi",
        type: "Government",
        establishedYear: 1961,
        programs: ["B.Tech Computer Science", "B.Tech Electrical", "B.Tech Mechanical", "B.Tech Civil"],
        fees: 250000,
        cutoffRank: "JEE Rank: 500-2000",
        placementRate: 95,
        facilities: ["Hostel", "Central Library", "Research Labs", "Wi-Fi Campus"],
        rating: 4.8,
        distance: 12,
        imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585"
      },
      {
        name: "Delhi Technological University",
        location: "Delhi",
        type: "Government",
        establishedYear: 1941,
        programs: ["B.Tech Computer Science", "B.Tech IT", "B.Tech Electronics"],
        fees: 180000,
        cutoffRank: "JEE Rank: 2000-8000",
        placementRate: 90,
        facilities: ["Hostel", "Library", "Internet", "Sports"],
        rating: 4.5,
        distance: 18,
        imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585"
      },
      {
        name: "All India Institute of Medical Sciences",
        location: "New Delhi",
        type: "Government",
        establishedYear: 1956,
        programs: ["MBBS", "MD", "B.Sc. Nursing", "Pharmacy"],
        fees: 5800,
        cutoffRank: "NEET Rank: 50",
        placementRate: 100,
        facilities: ["Teaching Hospital", "Research Centers", "Medical Library", "Student Clinics"],
        rating: 4.9,
        distance: 15,
        imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561"
      },
      {
        name: "Delhi University - Shaheed Sukhdev College of Business Studies",
        location: "Central Delhi",
        type: "Government",
        establishedYear: 1987,
        programs: ["B.Com (H)", "BBA", "B.A. Economics"],
        fees: 28000,
        cutoffRank: "95% in 12th",
        placementRate: 92,
        facilities: ["Computer Labs", "Business Library", "Seminar Halls", "Placement Cell"],
        rating: 4.4,
        distance: 10,
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80"
      },
      {
        name: "Delhi University",
        location: "Central Delhi", 
        type: "Government",
        establishedYear: 1922,
        programs: ["B.A. English", "B.Com", "B.Sc. Physics", "B.Sc. Mathematics"],
        fees: 15000,
        cutoffRank: "85% in 12th",
        placementRate: 88,
        facilities: ["Student Housing", "Multiple Libraries", "Sports Complex", "Career Services"],
        rating: 4.6,
        distance: 8,
        imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3"
      }
    ];

    await db.insert(colleges).values(collegeData);
  }
}

export const storage = new DatabaseStorage();
