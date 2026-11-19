import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

// A memory router lets the offline file-viewer iframe navigate despite its opaque origin.
// The deployed website keeps clean browser URLs.
const Router = window.__DMARK_STANDALONE__ ? MemoryRouter : BrowserRouter;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
