import Database from 'better-sqlite3';
import type { Database as SQLiteDatabase } from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

const dbPath = path.join(app.getPath('userData'), 'notation.db')
const db: SQLiteDatabase = new Database(dbPath);

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS puzzles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_id INTEGER,
    name TEXT NOT NULL,
    phases TEXT NOT NULL,
    FOREIGN KEY(puzzle_id) REFERENCES puzzles(id)
  );

  CREATE TABLE IF NOT EXISTS solves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_id INTEGER,
    method_id INTEGER,
    total_time INTEGER NOT NULL,
    date_timestamp INTEGER NOT NULL,
    FOREIGN KEY(puzzle_id) REFERENCES puzzles(id),
    FOREIGN KEY(method_id) REFERENCES methods(id)
  );

  CREATE TABLE IF NOT EXISTS splits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solve_id INTEGER,
    phase_name TEXT NOT NULL,
    split_time INTEGER NOT NULL,
    FOREIGN KEY(solve_id) REFERENCES solves(id)
  );
`)

db.exec(`
  INSERT OR IGNORE INTO puzzles (id, name) VALUES (1, '3x3');
  INSERT OR IGNORE INTO methods (id, puzzle_id, name, phases) VALUES (1, 1, 'CFOP', 'Cross,F2L,OLL,PLL');
`);

export default db
