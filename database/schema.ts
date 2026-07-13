import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender"),
  photo: text("photo"),
  createdAt: text("created_at").default("now()"),
});

export const userInterests = sqliteTable("user_interests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  interest: text("interest").notNull(),
});

export const characters = sqliteTable("characters", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  age: integer("age"),
  personality: text("personality"),
  appearance: text("appearance"),
  photo: text("photo"),
  embedding: text("embedding"),
  createdAt: text("created_at").default("now()"),
});

export const stories = sqliteTable("stories", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  seriesId: text("series_id"),
  characterId: text("character_id").references(() => characters.id),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  storyText: text("story_text").default(""),
  genre: text("genre"),
  style: text("style"),
  language: text("language").default("ar"),
  duration: text("duration"),
  status: text("status").default("draft"),
  coverImage: text("cover_image"),
  createdAt: text("created_at").default("now()"),
  updatedAt: text("updated_at").default("now()"),
});

export const storySeries = sqliteTable("story_series", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  createdAt: text("created_at").default("now()"),
});

export const scenes = sqliteTable("scenes", {
  id: text("id").primaryKey(),
  storyId: text("story_id")
    .notNull()
    .references(() => stories.id, { onDelete: "cascade" }),
  sceneNumber: integer("scene_number").notNull(),
  sceneText: text("scene_text").notNull(),
  imagePrompt: text("image_prompt"),
  imagePath: text("image_path"),
  audioPath: text("audio_path"),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  modelName: text("model_name").default("llama3.2"),
  language: text("language").default("ar"),
  theme: text("theme").default("dark"),
  artStyle: text("art_style").default("pixar"),
  ttsEnabled: integer("tts_enabled", { mode: "boolean" }).default(false),
  ttsVoice: text("tts_voice"),
});
