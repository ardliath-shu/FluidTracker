"use client";

import { useState, useImperativeHandle, forwardRef } from "react";

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

    const handleToggle = () => {
      if (collapsible) setIsOpen((prev) => !prev);
    };

    // Expose collapse() and expand() methods via ref
    useImperativeHandle(ref, () => ({
      collapse: () => setIsOpen(false),
      expand: () => setIsOpen(true),
      toggle: () => handleToggle(),
    }));

    return (
      <div
        className={`card ${dropdown || !collapsible || (collapsible && isOpen) ? colour : ""} ${dropdown ? "card-dropdown" : ""}`}
      >
        {title && (
          <div
            className={`card-header ${
              collapsible ? "card-header-collapsible" : ""
            }`}
            onClick={handleToggle}
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

export default Card;
