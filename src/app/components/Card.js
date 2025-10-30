"use client";

import { useState } from "react";

export default function Card({
  title,
  icon,
  colour,
  children,
  collapsible = false,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (collapsible) setIsOpen((prev) => !prev);
  };

  //   export default function CardComponent({ title, icon, colour, children }) {
  //   return (
  //     <div className={`card ${colour}`}>
  //       <div className="card-header">
  //         <i className={`fa ${icon}`}></i> {title}
  //       </div>
  //       <div className="card-body">{children}</div>
  //     </div>
  //   );
  // }

  return (
    <div className={`card ${colour}`}>
      {title && (
        <div
          className={`card-header ${collapsible ? "card-header-collapsible" : ""}`}
          onClick={handleToggle}
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
      <div className={`card-body ${isOpen ? "open" : "collapsed"}`}>
        {collapsible && <hr />}
        {children}
      </div>
    </div>
  );
}
