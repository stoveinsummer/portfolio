CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_key` text NOT NULL,
	`user_id` text NOT NULL,
	`author_name` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_comments_post_created` ON `comments` (`post_key`,`created_at`);--> statement-breakpoint
CREATE TABLE `workout_plans` (
	`user_id` text PRIMARY KEY NOT NULL,
	`plans_json` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `workout_sessions` ADD `request_key` text;--> statement-breakpoint
CREATE UNIQUE INDEX `workout_sessions_request_key_unique` ON `workout_sessions` (`request_key`);--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `exercise_type` text DEFAULT 'weight' NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `duration` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `distance` real DEFAULT 0 NOT NULL;