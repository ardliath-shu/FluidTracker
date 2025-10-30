"use client";

import { useState } from "react";

export default function Card({
  title,
  icon,
  colour,
  children,
  collapsible = false, // Optional for collapsible cards
  defaultOpen = true, // Optional default open state (if collapsible is true)
}) {
  // Manage collapsibale state
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const handleToggle = () => {
    if (collapsible) setIsOpen((prev) => !prev);
  };

  return (
    <div className={`card ${colour}`}>
      {/* If title is provided, show the card header */}
      {title && (
        <div
          className={`card-header ${collapsible ? "card-header-collapsible" : ""}`}
          onClick={handleToggle}
          title={isOpen ? "Close Panel" : "Open Panel"}
        >
          {/* Card Toggle Icon */}
          {collapsible && (
            <div className="card-toggle">{isOpen ? "▲" : "▼"}</div>
          )}

          {/* Card Title and Icon */}
          <div className="card-title">
            {icon && (
              <i
                className={`fa fa-fw ${icon}`}
                style={{ marginRight: "0.5rem" }}
              ></i>
            )}
            {title}
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className={`card-body ${isOpen ? "open" : "collapsed"}`}>
        {collapsible && <hr />}
        {children}
      </div>
    </div>
  );
}
