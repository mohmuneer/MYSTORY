import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

const DB_NAME = "mystory.db";

let _db: SQLiteDatabase | null = null;

export function getDatabase(): SQLiteDatabase {
  if (!_db) {
    _db = openDatabaseSync(DB_NAME);
  }
  return _db;
}

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT,
    photo TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS user_interests (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    age INTEGER,
    personality TEXT,
    appearance TEXT,
    photo TEXT,
    embedding TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS story_series (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    series_id TEXT,
    character_id TEXT REFERENCES characters(id),
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    story_text TEXT DEFAULT '',
    genre TEXT,
    style TEXT,
    language TEXT DEFAULT 'ar',
    duration TEXT,
    status TEXT DEFAULT 'draft',
    cover_image TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS scenes (
    id TEXT PRIMARY KEY NOT NULL,
    story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    scene_text TEXT NOT NULL,
    image_prompt TEXT,
    image_path TEXT,
    audio_path TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_name TEXT DEFAULT 'llama3.2',
    language TEXT DEFAULT 'ar',
    theme TEXT DEFAULT 'dark',
    art_style TEXT DEFAULT 'pixar',
    tts_enabled INTEGER DEFAULT 0,
    tts_voice TEXT
  )`,
];

export async function initializeDatabase() {
  try {
    const db = getDatabase();
    for (const sql of TABLES) {
      db.runSync(sql);
    }
  } catch (error) {
    console.warn("Database initialization error:", error);
  }
}
