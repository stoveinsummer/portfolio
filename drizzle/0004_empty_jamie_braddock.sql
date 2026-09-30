CREATE TABLE `google_calendar_connections` (
	`user_id` text PRIMARY KEY NOT NULL,
	`encrypted_refresh_token` text NOT NULL,
	`calendar_id` text DEFAULT 'primary' NOT NULL,
	`calendar_name` text DEFAULT 'Google Calendar' NOT NULL,
	`updated_at` text NOT NULL
);
