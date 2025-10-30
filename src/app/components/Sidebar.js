"use client";

import Link from "next/link";
import { signOutAction } from "../actions/auth";
import DarkModeToggle from "./DarkModeToggle";

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
  return (
    <aside
      className={`sidebar 
            ${isCollapsed ? "collapsed" : ""} 
            ${isOpen ? "open" : ""}`}
    >
      {/* Top section */}
      <div className="sidebar-top">
        <h2>
          Menu
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </h2>
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
        <div>
          {/* Use a form to bind the server action */}
          <form action={signOutAction} style={{ flexGrow: "1" }}>
            <button className="logout" type="submit">
              <i className="fa fa-fw fa-sign-out-alt"></i> Logout
            </button>
          </form>
          <DarkModeToggle />
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
