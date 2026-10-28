import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import type { Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

const databaseDir = mkdtempSync(path.join(tmpdir(), "egp-auth-"));
process.env.JWT_SECRET = "test-secret-test-secret-test-secret";
process.env.DATABASE_PATH = path.join(databaseDir, "egp.sqlite");

const { createApp } = await import("./app.js");
const { closeDatabase } = await import("./db.js");

let server: Server;
let baseUrl = "";

before(async () => {
  server = createApp().listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => {
    server.once("listening", () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Test server did not receive a port.");
  }
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  closeDatabase();
  rmSync(databaseDir, { recursive: true, force: true });
});

async function post(pathname: string, body: unknown) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

test("signup creates an account and returns a token", async () => {
  const result = await post("/auth/signup", {
    email: "Owner@Example.com",
    password: "garage-pass",
    name: "Aslam",
  });

  assert.equal(result.status, 201);
  assert.equal(result.data.user.email, "owner@example.com");
  assert.equal(result.data.user.name, "Aslam");
  assert.equal(typeof result.data.token, "string");
  assert.equal("password" in result.data.user, false);
  assert.equal("password_hash" in result.data.user, false);
});

test("signup rejects a duplicate email and a short password", async () => {
  const duplicate = await post("/auth/signup", {
    email: "owner@example.com",
    password: "garage-pass",
  });
  assert.equal(duplicate.status, 409);

  const shortPassword = await post("/auth/signup", {
    email: "new-owner@example.com",
    password: "short",
  });
  assert.equal(shortPassword.status, 400);
});

test("signin returns the same user and rejects a wrong password", async () => {
  const wrong = await post("/auth/signin", {
    email: "owner@example.com",
    password: "wrong-pass",
  });
  assert.equal(wrong.status, 401);

  const correct = await post("/auth/signin", {
    email: "owner@example.com",
    password: "garage-pass",
  });
  assert.equal(correct.status, 200);
  assert.equal(correct.data.user.email, "owner@example.com");

  const me = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${correct.data.token}` },
  });
  const meData = await me.json();
  assert.equal(me.status, 200);
  assert.equal(meData.user.email, "owner@example.com");
  assert.equal(meData.user.name, "Aslam");
});

test("current user route rejects a missing token", async () => {
  const response = await fetch(`${baseUrl}/auth/me`);
  assert.equal(response.status, 401);
});
