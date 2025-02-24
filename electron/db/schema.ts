import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import * as fs from "fs"

// Define database path
const userDataPath = app.getPath('userData');
const dbDir = path.join(userDataPath, 'AMDownloader');

// Check if the directory exists; if not, create it
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'database.sqlite');

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// Define table
export const downloads = sqliteTable('downloads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  status: text('status').notNull(),
});

// Ensure table exists
sqlite.prepare(`
  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    status TEXT NOT NULL
  )
`).run();
