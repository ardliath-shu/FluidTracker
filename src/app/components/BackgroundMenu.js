"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const backgrounds = [
  { name: "School", className: "school", src: "/images/school_thumb.png" },
  { name: "Office", className: "office", src: "/images/office_thumb.png" },
  {
    name: "Outdoors",
    className: "outdoors",
    src: "/images/outdoors_thumb.png",
  },
  { name: "None", className: "no-bg", src: "" },
];

export default function BackgroundMenu() {
  const [showBgGrid, setShowBgGrid] = useState(false);
  const [selected, setSelected] = useState("");

  // Load the saved background from localStorage and apply it on load
  useEffect(() => {
    const stored = localStorage.getItem("backgroundClass") || "";
    setSelected(stored);
    const main = document.querySelector("main");
    if (main) main.className = stored;
  }, []);

  // Handle new background selection
  const handleSelect = (bgClass) => {
    const main = document.querySelector("main");
    if (main) main.className = bgClass;
    localStorage.setItem("backgroundClass", bgClass); // persist it
    setSelected(bgClass);
  };

  return (
    <>
      <div
        className={`sidebar-subitem ${showBgGrid ? "open" : ""}`}
        onClick={() => setShowBgGrid((s) => !s)}
      >
        <i
          className={`fa fa-fw fa-chevron-${showBgGrid ? "down" : "right"}`}
          aria-hidden="true"
        ></i>
        <span>Background</span>
      </div>

      {showBgGrid && (
        <div className="background-grid">
          {backgrounds.map((bg) => (
            <div
              key={bg.name}
              title={bg.name}
              className={`background-thumb ${
                selected === bg.className ? "selected" : ""
              }`}
              onClick={() => handleSelect(bg.className)}
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
