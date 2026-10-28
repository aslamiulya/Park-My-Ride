import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
};

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let database: DatabaseSync | null = null;

function databasePath() {
  return process.env.DATABASE_PATH ?? path.join(apiRoot, "data", "egp.sqlite");
}

export function getDb() {
  if (database) return database;

  const filePath = databasePath();
  mkdirSync(path.dirname(filePath), { recursive: true });

  database = new DatabaseSync(filePath);
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  return database;
}

export function closeDatabase() {
  database?.close();
  database = null;
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export function findUserByEmail(email: string) {
  return getDb()
    .prepare(
      `SELECT id, email, name, password_hash, created_at
       FROM users
       WHERE email = ?`,
    )
    .get(email) as UserRecord | undefined;
}

export function findUserById(id: string) {
  return getDb()
    .prepare(
      `SELECT id, email, name, password_hash, created_at
       FROM users
       WHERE id = ?`,
    )
    .get(id) as UserRecord | undefined;
}

export function insertUser(user: UserRecord) {
  getDb()
    .prepare(
      `INSERT INTO users (id, email, name, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(user.id, user.email, user.name, user.password_hash, user.created_at);
}

export function isUniqueEmailError(error: unknown) {
  return (
    error instanceof Error && error.message.includes("UNIQUE constraint failed")
  );
}
