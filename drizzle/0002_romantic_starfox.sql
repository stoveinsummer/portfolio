CREATE TABLE `content_posts` (
	`post_key` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`payload_json` text NOT NULL,
	`updated_by` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `home_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`order_json` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `uploaded_images` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`user_id` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text NOT NULL
);
