import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

export async function openDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'database.sqlite'),
      driver: sqlite3.Database,
    });
    
    // Create tables if they don't exist
    await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      day TEXT NOT NULL, -- Changed from DATE to TEXT
      checked INTEGER NOT NULL -- Changed from BOOLEAN to INTEGER (0 or 1)
    );
    
      
    `);
  }
  
  return db;
}