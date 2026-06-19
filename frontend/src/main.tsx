

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// @ts-ignore: allow importing CSS without type declarations
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);