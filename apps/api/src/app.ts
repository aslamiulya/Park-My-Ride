import cors from "cors";
import express from "express";
import { authRouter } from "./auth.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "event-garage-parking-api",
    });
  });

  app.use("/auth", authRouter);

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({ error: "Request body must be valid JSON." });
        return;
      }
      next(error);
    },
  );

  return app;
}
