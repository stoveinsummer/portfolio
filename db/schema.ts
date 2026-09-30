import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workoutSessions = sqliteTable("workout_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").notNull(), workoutDate: text("workout_date").notNull(),
  routine: text("routine").notNull(), requestKey: text("request_key").unique(), bodyWeight: real("body_weight"), backCondition: integer("back_condition").notNull().default(3),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_workout_sessions_user_date").on(table.userId, table.workoutDate)]);

export const workoutSets = sqliteTable("workout_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }), sessionId: integer("session_id").notNull().references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseKey: text("exercise_key").notNull(), exerciseName: text("exercise_name").notNull(), setNumber: integer("set_number").notNull(),
  exerciseType: text("exercise_type").notNull().default("weight"), duration: real("duration").notNull().default(0), distance: real("distance").notNull().default(0), weight: real("weight").notNull(), reps: integer("reps").notNull(), rir: integer("rir").notNull().default(2),
}, (table) => [index("idx_workout_sets_session").on(table.sessionId)]);

export const workoutPlans = sqliteTable("workout_plans", {
  userId: text("user_id").primaryKey(),
  plansJson: text("plans_json").notNull(),
});
export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(), postKey: text("post_key").notNull(), userId: text("user_id").notNull(),
  authorName: text("author_name").notNull(), body: text("body").notNull(),
  createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
}, (t) => [index("idx_comments_post_created").on(t.postKey, t.createdAt)]);

export const contentPosts = sqliteTable("content_posts", {
  postKey: text("post_key").primaryKey(), kind: text("kind").notNull(),
  payloadJson: text("payload_json").notNull(), updatedBy: text("updated_by").notNull(),
  revision: integer("revision").notNull().default(1), updatedAt: text("updated_at").notNull(),
});
export const homePreferences = sqliteTable("home_preferences", {
  userId: text("user_id").primaryKey(), orderJson: text("order_json").notNull(),
});
export const uploadedImages = sqliteTable("uploaded_images", {
  id: text("id").primaryKey(), objectKey: text("object_key").notNull(),
  userId: text("user_id").notNull(), contentType: text("content_type").notNull(),
  size: integer("size").notNull(), createdAt: text("created_at").notNull(),
});
export const investmentLedgers = sqliteTable("investment_ledgers", {
  userId: text("user_id").primaryKey(),
  payloadJson: text("payload_json").notNull(),
  revision: integer("revision").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
});
export const googleCalendarConnections = sqliteTable("google_calendar_connections", {
  userId: text("user_id").primaryKey(),
  encryptedRefreshToken: text("encrypted_refresh_token").notNull(),
  calendarId: text("calendar_id").notNull().default("primary"),
  calendarName: text("calendar_name").notNull().default("Google Calendar"),
  updatedAt: text("updated_at").notNull(),
});
export const googleCalendarOAuthSettings = sqliteTable("google_calendar_oauth_settings", {
  userId: text("user_id").primaryKey(),
  encryptedClientId: text("encrypted_client_id").notNull(),
  encryptedClientSecret: text("encrypted_client_secret").notNull(),
  updatedAt: text("updated_at").notNull(),
});
