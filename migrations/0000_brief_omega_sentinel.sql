CREATE TABLE "career_paths" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"average_salary_min" integer NOT NULL,
	"average_salary_max" integer NOT NULL,
	"job_growth_rate" real NOT NULL,
	"required_skills" jsonb NOT NULL,
	"job_opportunities" jsonb NOT NULL,
	"icon" varchar NOT NULL,
	"color" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colleges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"location" varchar NOT NULL,
	"type" varchar DEFAULT 'Government' NOT NULL,
	"established_year" integer,
	"programs" jsonb NOT NULL,
	"fees" integer NOT NULL,
	"cutoff_rank" varchar,
	"placement_rate" real,
	"facilities" jsonb NOT NULL,
	"rating" real,
	"distance" real,
	"image_url" varchar,
	"average_package" integer,
	"highest_package" integer,
	"medium_of_instruction" varchar DEFAULT 'English',
	"accreditation" varchar,
	"affiliated_university" varchar,
	"hostel_facility" boolean DEFAULT false,
	"library_facility" boolean DEFAULT false,
	"sports_complex" boolean DEFAULT false,
	"medical_facility" boolean DEFAULT false,
	"research_facility" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quiz_assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"responses" jsonb NOT NULL,
	"results" jsonb NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"event_date" timestamp NOT NULL,
	"event_type" varchar NOT NULL,
	"is_completed" boolean DEFAULT false,
	"is_notified" boolean DEFAULT false,
	"college_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_career_matches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"career_path_id" varchar NOT NULL,
	"match_percentage" real NOT NULL,
	"assessment_id" varchar,
	"ai_recommendation" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_notification_preferences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"admission_deadlines" boolean DEFAULT true,
	"scholarship_deadlines" boolean DEFAULT true,
	"exam_dates" boolean DEFAULT true,
	"email_notifications" boolean DEFAULT true,
	"push_notifications" boolean DEFAULT true,
	"reminder_days_before" integer DEFAULT 7,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"current_class" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "quiz_assessments" ADD CONSTRAINT "quiz_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_college_id_colleges_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."colleges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_matches" ADD CONSTRAINT "user_career_matches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_matches" ADD CONSTRAINT "user_career_matches_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_matches" ADD CONSTRAINT "user_career_matches_assessment_id_quiz_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."quiz_assessments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");