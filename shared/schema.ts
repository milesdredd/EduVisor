import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  currentClass: varchar("current_class"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz assessments table
export const quizAssessments = pgTable("quiz_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  responses: jsonb("responses").notNull(),
  results: jsonb("results").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Career paths table
export const careerPaths = pgTable("career_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  averageSalaryMin: integer("average_salary_min").notNull(),
  averageSalaryMax: integer("average_salary_max").notNull(),
  jobGrowthRate: real("job_growth_rate").notNull(),
  requiredSkills: jsonb("required_skills").notNull(),
  jobOpportunities: jsonb("job_opportunities").notNull(),
  icon: varchar("icon").notNull(),
  color: varchar("color").notNull(),
});

// Government colleges table
export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  location: varchar("location").notNull(),
  type: varchar("type").notNull().default("Government"),
  establishedYear: integer("established_year"),
  programs: jsonb("programs").notNull(),
  fees: integer("fees").notNull(),
  cutoffRank: varchar("cutoff_rank"),
  placementRate: real("placement_rate"),
  facilities: jsonb("facilities").notNull(),
  rating: real("rating"),
  distance: real("distance"),
  imageUrl: varchar("image_url"),
  // Advanced filtering fields
  averagePackage: integer("average_package"), // In lakhs
  highestPackage: integer("highest_package"), // In lakhs
  mediumOfInstruction: varchar("medium_of_instruction").default("English"),
  accreditation: varchar("accreditation"), // NAAC, NBA, etc.
  affiliatedUniversity: varchar("affiliated_university"),
  hostelFacility: boolean("hostel_facility").default(false),
  libraryFacility: boolean("library_facility").default(false),
  sportsComplex: boolean("sports_complex").default(false),
  medicalFacility: boolean("medical_facility").default(false),
  researchFacility: boolean("research_facility").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User career matches table
export const userCareerMatches = pgTable("user_career_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  careerPathId: varchar("career_path_id").notNull().references(() => careerPaths.id),
  matchPercentage: real("match_percentage").notNull(),
  assessmentId: varchar("assessment_id").references(() => quizAssessments.id),
  aiRecommendation: text("ai_recommendation"), // AI-generated career insight
  createdAt: timestamp("created_at").defaultNow(),
});

// Timeline tracker for admission dates and deadlines
export const timelineEvents = pgTable("timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventType: varchar("event_type").notNull(), // admission, scholarship, exam, etc.
  isCompleted: boolean("is_completed").default(false),
  isNotified: boolean("is_notified").default(false),
  collegeId: varchar("college_id").references(() => colleges.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences for notifications
export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  admissionDeadlines: boolean("admission_deadlines").default(true),
  scholarshipDeadlines: boolean("scholarship_deadlines").default(true),
  examDates: boolean("exam_dates").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  reminderDaysBefore: integer("reminder_days_before").default(7),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertQuizAssessment = typeof quizAssessments.$inferInsert;
export type QuizAssessment = typeof quizAssessments.$inferSelect;
export type InsertCareerPath = typeof careerPaths.$inferInsert;
export type CareerPath = typeof careerPaths.$inferSelect;
export type InsertCollege = typeof colleges.$inferInsert;
export type College = typeof colleges.$inferSelect;

export type InsertUserCareerMatch = typeof userCareerMatches.$inferInsert;
export type UserCareerMatch = typeof userCareerMatches.$inferSelect & {
  careerPath?: {
    id: string;
    title: string;
    description: string;
    averageSalaryMin: number;
    averageSalaryMax: number;
    jobGrowthRate: number;
  };
};

export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export type InsertUserNotificationPreferences = typeof userNotificationPreferences.$inferInsert;
export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;

export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertUserNotificationPreferences = typeof userNotificationPreferences.$inferInsert;
export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;

export const insertQuizAssessmentSchema = createInsertSchema(quizAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  createdAt: true,
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserNotificationPreferencesSchema = createInsertSchema(userNotificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
