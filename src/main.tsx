import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Global protection: Prevent mouse wheel from incrementing/decrementing number/amount inputs
if (typeof window !== "undefined") {
  window.addEventListener(
    "wheel",
    () => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.type === "number") {
        active.blur();
      }
    },
    { passive: true }
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
