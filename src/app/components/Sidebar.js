"use client";
import { useEffect } from "react";

const prefix = "../../../../"; // Hack to return to home from nested cms/insert etc
const links = [
  { name: 'Dashboard', icon: "fa-tachometer-alt", href: prefix }, // Hack to return to home from nested cms/insert etc
  { name: 'Profile', icon: "fa-user", href: "#" },
  { name: 'Settings', icon: "fa-cog", href: "#" },
  { name: 'Elements', icon: "fa-th", href: prefix + "elements" }, // Hack to return to home from nested cms/insert etc
  { name: 'Generic Page', icon: "fa-file", href: prefix + "generic" }, // Hack to return to home from nested cms/insert etc
]

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
                <hr />
                <ul>
                    {links.map(link => (
                        <li key={link.name}>
                            <a href={link.href}>
                                <i className={`fa fa-fw ${link.icon}`}></i> {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bottom section */}
            <div className="sidebar-bottom">
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a href="#"><i className="fa fa-fw fa-sign-out-alt"></i> Logout</a>

                    <a href="#" title="Toggle dark mode" onClick={handleToggleDarkMode}><i className="fa fa-fw fa-circle-half-stroke"></i></a>
                </div>
            </div>

            {/* Floating reopen button (desktop only) */}
            {isCollapsed && (
                <button className="show-sidebar-btn" onClick={onReopen}>
                    &#9776;
                </button>
            )}
        </aside>

    );
}
