"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState("");

  // Handle click to dark-mode toggle and save to local storage
  const handleToggleDarkMode = (e) => {
    e.preventDefault(); // Prevent default link behavior
    const isDarkMode = localStorage.getItem("dark-mode") === "true";
    localStorage.setItem("dark-mode", !isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
    setDarkMode(!isDarkMode);
  };

  // Manage dark-mode on load and add class to body based on local storage
  useEffect(() => {
    const isDarkMode = localStorage.getItem("dark-mode") === "true";
    document.body.classList.toggle("dark-mode", isDarkMode);
    setDarkMode(isDarkMode);
  }, []);

  return (
    <div className="dark-mode-toggle">
      <button
        type="button"
        onClick={handleToggleDarkMode}
        title="Toggle dark mode."
      >
        {darkMode ? (
          <i className="fa-solid fa-sun"></i>
        ) : (
          <i className="fa-solid fa-moon"></i>
        )}
      </button>
    </div>
  );
}
