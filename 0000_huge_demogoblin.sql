CREATE TABLE `ai_summaries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer NOT NULL,
	`short_profile_json` text DEFAULT '[]' NOT NULL,
	`matched_requirements_json` text DEFAULT '[]' NOT NULL,
	`missing_requirements_json` text DEFAULT '[]' NOT NULL,
	`interview_questions_json` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`source` text DEFAULT 'AI summary' NOT NULL,
	`error_message` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_ai_summaries_application_id` ON `ai_summaries` (`application_id`);--> statement-breakpoint
CREATE TABLE `application_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer NOT NULL,
	`from_stage` text,
	`to_stage` text NOT NULL,
	`actor_id` text NOT NULL,
	`reason` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_history_application_id` ON `application_history` (`application_id`);--> statement-breakpoint
CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`candidate_id` text NOT NULL,
	`cv_file_id` integer NOT NULL,
	`stage` text DEFAULT 'Applied' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_applications_job_id` ON `applications` (`job_id`);--> statement-breakpoint
CREATE INDEX `idx_applications_candidate_id` ON `applications` (`candidate_id`);--> statement-breakpoint
CREATE INDEX `idx_applications_stage` ON `applications` (`stage`);--> statement-breakpoint
CREATE TABLE `cv_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` text NOT NULL,
	`storage_key` text NOT NULL,
	`file_name` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`content_type` text DEFAULT 'application/pdf' NOT NULL,
	`text_excerpt` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_cv_files_candidate_id` ON `cv_files` (`candidate_id`);--> statement-breakpoint
CREATE TABLE `email_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer,
	`recipient_email` text NOT NULL,
	`event_type` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`sent_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_email_events_application_id` ON `email_events` (`application_id`);--> statement-breakpoint
CREATE INDEX `idx_email_events_status` ON `email_events` (`status`);--> statement-breakpoint
CREATE TABLE `interviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer NOT NULL,
	`recruiter_id` text NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`location` text NOT NULL,
	`meeting_link` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_interviews_application_id` ON `interviews` (`application_id`);--> statement-breakpoint
CREATE INDEX `idx_interviews_recruiter_time` ON `interviews` (`recruiter_id`,`starts_at`,`ends_at`);--> statement-breakpoint
CREATE TABLE `job_recruiters` (
	`job_id` integer NOT NULL,
	`recruiter_id` text NOT NULL,
	`assigned_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`job_id`, `recruiter_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_job_recruiters_recruiter_id` ON `job_recruiters` (`recruiter_id`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`department` text NOT NULL,
	`location` text NOT NULL,
	`job_type` text NOT NULL,
	`description` text NOT NULL,
	`requirements` text NOT NULL,
	`closing_date` text NOT NULL,
	`openings` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_jobs_status_closing_date` ON `jobs` (`status`,`closing_date`);--> statement-breakpoint
CREATE INDEX `idx_jobs_created_by` ON `jobs` (`created_by`);--> statement-breakpoint
CREATE TABLE `recruiter_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer NOT NULL,
	`recruiter_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_notes_application_id` ON `recruiter_notes` (`application_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'candidate' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);