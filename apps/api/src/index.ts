import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(apiRoot, ".env") });

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing. Add it to apps/api/.env (see apps/api/.env.example).",
  );
}

const { createApp } = await import("./app.js");

const port = Number(process.env.PORT) || 4000;

createApp().listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
