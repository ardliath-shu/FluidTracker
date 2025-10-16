"use client";
import { useEffect } from "react";
import Link from "next/link";
import { signOutAction } from "../actions/auth";

const prefix = "../../../../"; // Hack to return to home from nested cms/insert etc
const links = [
  { name: "Dashboard", icon: "fa-tachometer-alt", href: prefix },
  { name: "Add Drink", icon: "fa-bottle-water", href: prefix + "add" },
  { name: "Profile", icon: "fa-user", href: "#" },
  { name: "Settings", icon: "fa-cog", href: "#" },
  { name: "Elements", icon: "fa-th", href: prefix + "elements" },
  { name: "Generic Page", icon: "fa-file", href: prefix + "generic" },
];

export default function Sidebar({ isOpen, isCollapsed, onClose, onReopen }) {
  // Handle click to dark-mode toggle and save to local storage
  const handleToggleDarkMode = (e) => {
    e.preventDefault(); // Prevent default link behavior
    const isDarkMode = localStorage.getItem("dark-mode") === "true";
    localStorage.setItem("dark-mode", !isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  // Manage dark-mode on load and add class to body based on local storage
  useEffect(() => {
    const isDarkMode = localStorage.getItem("dark-mode") === "true";
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, []);

  return (
    <aside
      className={`sidebar 
            ${isCollapsed ? "collapsed" : ""} 
            ${isOpen ? "open" : ""}`}
    >
      {/* Top section */}
      <div className="sidebar-top">
        <h5>
          Menu
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </h5>
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <Link href={link.href}>
                <i className={`fa fa-fw ${link.icon}`}></i> {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <hr />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Use a form to bind the server action */}
          <form action={signOutAction}>
            <button
              type="submit"
              title="Logout"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              <i className="fa fa-fw fa-sign-out-alt"></i> Logout
            </button>
          </form>

          <Link
            href="#"
            title="Toggle dark mode"
            onClick={handleToggleDarkMode}
          >
            <i className="fa fa-fw fa-circle-half-stroke"></i>
          </Link>
        </div>
      </div>

      {/* Floating reopen button (desktop only) */}
      {isCollapsed && (
        <button className="show-sidebar-btn" onClick={onReopen}>
          &#9776; {/* burger menu icon */}
        </button>
      )}
    </aside>
  );
}
