import Database from "better-sqlite3"
import { app } from "electron"
import * as fs from "fs"
import * as path from "path"
import { createRepository } from "./repository"

const userDataPath = app.getPath("userData")
const dbDir = path.join(userDataPath, "Shabdiz-data")
const dbPath = path.join(dbDir, "database.sqlite")

let db: Database.Database

export function initDatabase(): void {
  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  db = new Database(dbPath)
  db.pragma("journal_mode = WAL")

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS downloads (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      bitfield TEXT NOT NULL,
      completedLength TEXT NOT NULL,
      connections TEXT NOT NULL DEFAULT '0',
      dir TEXT NOT NULL,
      downloadSpeed TEXT NOT NULL,
      errorCode TEXT NOT NULL DEFAULT '0',
      errorMessage TEXT NOT NULL DEFAULT '0',
      files TEXT NOT NULL DEFAULT '[]',
      gid TEXT NOT NULL,
      numPieces TEXT NOT NULL,
      pieceLength TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'waiting',
      totalLength TEXT NOT NULL,
      uploadLength TEXT NOT NULL,
      schedulerQueue INTEGER NOT NULL DEFAULT 0,
      optionOverrides TEXT NOT NULL DEFAULT '{}',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS torrents (
      gid TEXT PRIMARY KEY,
      infoHash TEXT NOT NULL,
      bittorrent TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'waiting',
      completedLength TEXT NOT NULL DEFAULT '0',
      totalLength TEXT NOT NULL DEFAULT '0',
      numPieces TEXT NOT NULL DEFAULT '0',
      pieceLength TEXT NOT NULL DEFAULT '0',
      downloadSpeed TEXT NOT NULL DEFAULT '0',
      uploadSpeed TEXT NOT NULL DEFAULT '0',
      uploadLength TEXT NOT NULL DEFAULT '0',
      connections TEXT NOT NULL DEFAULT '0',
      numSeeders TEXT NOT NULL DEFAULT '0',
      seeder TEXT NOT NULL DEFAULT 'false',
      files TEXT NOT NULL DEFAULT '[]',
      dir TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      schedulerQueue INTEGER NOT NULL DEFAULT 0,
      optionOverrides TEXT NOT NULL DEFAULT '{}'
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS scheduler (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      gid TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log("[Database] better-sqlite3 initialized at", dbPath)
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.")
  }
  return db
}

export const DownloadRepo = createRepository({
  tableName: "downloads",
  jsonFields: ["files", "optionOverrides"],
  validColumns: [
    "bitfield",
    "completedLength",
    "connections",
    "dir",
    "downloadSpeed",
    "errorCode",
    "errorMessage",
    "files",
    "gid",
    "numPieces",
    "pieceLength",
    "status",
    "totalLength",
    "uploadLength",
    "schedulerQueue",
    "optionOverrides"
  ]
})

export const TorrentRepo = createRepository({
  tableName: "torrents",
  jsonFields: ["files", "optionOverrides", "bittorrent"],
  validColumns: [
    "gid",
    "infoHash",
    "bittorrent",
    "status",
    "completedLength",
    "totalLength",
    "numPieces",
    "pieceLength",
    "downloadSpeed",
    "uploadSpeed",
    "uploadLength",
    "connections",
    "numSeeders",
    "seeder",
    "files",
    "dir",
    "schedulerQueue",
    "optionOverrides"
  ]
})

export const SchedulerRepo = createRepository({
  tableName: "scheduler"
})

// In() helper for WHERE IN queries
export function In(values: unknown[]): { values: unknown[] } {
  return { values }
}
