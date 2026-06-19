import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./backend/api/routes";

// Load local environment secrets
dotenv.config();

async function startServer() {
  const app = express();
  
  // ✅ Parse PORT as number with fallback
  const PORT = parseInt(process.env.PORT || "7860", 10);

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
    
    // ✅ Serve static files FIRST (before catch-all)
    app.use(express.static(distPath));
    
    // ✅ Catch-all route for SPA - but ONLY if the file doesn't exist
    // This must come AFTER static file serving
    app.get("*", (req, res) => {
      // Skip if it's an API route (already handled above)
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      
      // ✅ Check if the request is for a static asset (css, js, etc.)
      // If it has a file extension, it should have been handled by express.static
      // If we get here, it's a route that should serve index.html
      const filePath = path.join(distPath, "index.html");
      console.log(`📄 Serving SPA route: ${req.path} -> index.html`);
      res.sendFile(filePath);
    });
  }

  // ✅ Use PORT variable (now a number)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Crisis Analyzer] Full-stack engine running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   API: http://localhost:${PORT}/api`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error("Critical boot failure inside server.ts:", err);
  process.exit(1);
});