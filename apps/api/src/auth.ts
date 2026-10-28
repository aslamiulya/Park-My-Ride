import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import {
  findUserByEmail,
  findUserById,
  insertUser,
  isUniqueEmailError,
  toPublicUser,
  type PublicUser,
} from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { readAccessToken, signAccessToken } from "./tokens.js";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Credentials = {
  email: string;
  password: string;
  name?: string;
};

function readCredentials(body: unknown): Credentials | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Email and password are required." };
  }

  const record = body as Record<string, unknown>;
  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const password = typeof record.password === "string" ? record.password : "";
  const name = typeof record.name === "string" ? record.name.trim() : undefined;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: "Enter a valid email address." };
  }
  if (name && name.length > 80) {
    return { error: "Name must be 80 characters or fewer." };
  }

  return { email, password, name: name || undefined };
}

function passwordLengthError(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 128) return "Password must be 128 characters or fewer.";
  return "";
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }

  try {
    const claims = readAccessToken(match[1]);
    const user = findUserById(claims.sub);
    if (!user) {
      res.status(401).json({ error: "Sign in required." });
      return;
    }
    req.user = toPublicUser(user);
    next();
  } catch {
    res.status(401).json({ error: "Sign in required." });
  }
}

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const credentials = readCredentials(req.body);
  if ("error" in credentials) {
    res.status(400).json({ error: credentials.error });
    return;
  }

  const lengthError = passwordLengthError(credentials.password);
  if (lengthError) {
    res.status(400).json({ error: lengthError });
    return;
  }

  const passwordHash = await hashPassword(credentials.password);
  const user = {
    id: randomUUID(),
    email: credentials.email,
    name: credentials.name || credentials.email.split("@")[0],
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  };

  try {
    insertUser(user);
  } catch (error) {
    if (isUniqueEmailError(error)) {
      res.status(409).json({ error: "An account with that email already exists." });
      return;
    }
    throw error;
  }

  const publicUser = toPublicUser(user);
  res.status(201).json({
    token: signAccessToken(publicUser),
    user: publicUser,
  });
});

authRouter.post("/signin", async (req, res) => {
  const credentials = readCredentials(req.body);
  if ("error" in credentials) {
    res.status(400).json({ error: credentials.error });
    return;
  }

  const user = findUserByEmail(credentials.email);
  const passwordMatches = user
    ? await verifyPassword(credentials.password, user.password_hash)
    : false;

  if (!user || !passwordMatches) {
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }

  const publicUser = toPublicUser(user);
  res.json({
    token: signAccessToken(publicUser),
    user: publicUser,
  });
});

authRouter.get("/me", requireUser, (req, res) => {
  res.json({ user: req.user });
});
