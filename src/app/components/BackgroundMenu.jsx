"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const backgrounds = [
  { name: "None", className: "no-bg", src: "" },
  {
    name: "Outdoors",
    className: "outdoors",
    src: "/images/outdoors_thumb.avif",
  },
  { name: "School", className: "school", src: "/images/school_thumb.avif" },
  { name: "Office", className: "office", src: "/images/office_thumb.avif" },
];

export default function BackgroundMenu() {
  const [showBgGrid, setShowBgGrid] = useState(false);
  const [selected, setSelected] = useState("");

  // Load the saved background from localStorage and apply it on load
  useEffect(() => {
    const stored = localStorage.getItem("backgroundClass") || "";
    // No actual risk as the dependency list is empty, ignore.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(stored);
    const main = document.querySelector("main");

    if (main) {
      main.className = stored;
    }
  }, []);

  // Handle new background selection
  const handleSelect = (bgClass) => {
    const main = document.querySelector("main");

    if (main) {
      main.className = bgClass;
    }

    localStorage.setItem("backgroundClass", bgClass); // persist it
    setSelected(bgClass);
  };

  return (
    <>
      <div
        className={`sidebar-subitem ${showBgGrid ? "open" : ""}`}
        onClick={() => setShowBgGrid((s) => !s)}
        onKeyDown={(e) => {
          // Allow toggle with Enter or Space
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowBgGrid((s) => !s);
          }
          if (e.key === "Tab") {
            setShowBgGrid(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={showBgGrid}
        aria-controls="background-grid"
        title="Toggle Background Selection"
      >
        <i className={`fa fa-fw fa-chevron-right`} aria-hidden="true"></i>
        <span>Background</span>
      </div>

      {showBgGrid && (
        <div className="background-grid">
          {backgrounds.map((bg) => (
            <div
              key={bg.name}
              title={bg.name == "None" ? "" : bg.name}
              className={`background-thumb ${
                selected === bg.className ? "selected" : ""
              }`}
              onClick={() => handleSelect(bg.className)}
              onKeyDown={(e) => {
                // Allow selection with Enter or Space
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(bg.className);
                }
              }}
              tabIndex={0}
              role="button"
            >
              {bg.src ? (
                <Image src={bg.src} alt={bg.name} width={100} height={60} />
              ) : (
                <div className="background-none">None</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
