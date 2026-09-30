CREATE TABLE `google_calendar_oauth_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`encrypted_client_id` text NOT NULL,
	`encrypted_client_secret` text NOT NULL,
	`updated_at` text NOT NULL
);
