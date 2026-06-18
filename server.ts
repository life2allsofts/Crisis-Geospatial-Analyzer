import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./backend/api/routes";

// Load local environment secrets
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 7860;

  // Setup standard JSON body encoders
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Bind API Routing paths
  app.use("/api", apiRouter);

  // Serve static assets / Vite bundles depending on Environment status
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring development environment... Booting Vite HMR proxy.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Configuring production environment... serving compiled assets.");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve production bundle
    app.use(express.static(distPath));
    
    // Catch-all route feeds client-side SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Crisis Analyzer] Full-stack engine running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical boot failure inside server.ts:", err);
  process.exit(1);
});
