"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

const Card = forwardRef(
  (
    {
      title,
      icon,
      colour,
      children,
      collapsible = false,
      defaultOpen = true,
      onToggle,
      dropdown = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
      setIsOpen(defaultOpen);
    }, [defaultOpen]);

    const handleToggle = () => {
      if (collapsible) setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (e) => {
      // Allow toggle with Enter or Space
      if ((e.key === "Enter" || e.key === " ") && collapsible) {
        e.preventDefault();
        handleToggle();
      }
      // If tbl key is used to focus, open the card
      if (e.key === "Tab" && collapsible) {
        setIsOpen(true);
      }
    };

    // Expose collapse() and expand() methods via ref
    useImperativeHandle(ref, () => ({
      collapse: () => setIsOpen(false),
      expand: () => setIsOpen(true),
      toggle: () => handleToggle(),
    }));

    // Title with all spaces replaced for a -
    const titleId = title ? `card-body-${title.replace(/\s+/g, "-")}` : null;

    return (
      <div
        className={`card ${dropdown || !collapsible || (collapsible && isOpen) ? colour : ""} ${collapsible ? "card-collapsible" : ""} ${dropdown ? "card-dropdown" : ""}`}
      >
        {title && (
          <div
            className={`card-header ${
              collapsible ? "card-header-collapsible" : ""
            }`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={collapsible ? 0 : undefined}
            role={collapsible ? "button" : undefined}
            aria-expanded={collapsible ? isOpen : undefined}
            aria-controls={collapsible ? `${titleId}` : undefined}
            title={isOpen ? "Close Panel" : "Open Panel"}
          >
            {collapsible && (
              <div className="card-toggle">{isOpen ? "▲" : "▼"}</div>
            )}
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

        <div
          id={titleId}
          className={`card-body ${isOpen ? "open" : "collapsed"}`}
          onClick={() => onToggle?.(isOpen)}
        >
          {collapsible && <hr />}
          {children}
        </div>
      </div>
    );
  },
);
Card.displayName = "Card";

export default Card;
