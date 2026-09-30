CREATE TABLE `investment_ledgers` (
	`user_id` text PRIMARY KEY NOT NULL,
	`payload_json` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
