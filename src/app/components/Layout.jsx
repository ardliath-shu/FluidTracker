"use client";

import { useState } from "react";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const isDesktop = useMediaQuery("(min-width: 992px)");

  const [isSidebarOpen, setSidebarOpen] = useState(false); // mobile only
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop only

  const handleSidebarClose = () => {
    if (isDesktop) {
      setSidebarCollapsed(true); // collapse on desktop
    } else {
      setSidebarOpen(false); // close on mobile
    }
  };

  const handleSidebarReopen = () => {
    if (isDesktop) {
      setSidebarCollapsed(false); // expand on desktop
    } else {
      setSidebarOpen(true); // open on mobile
    }
  };

  return (
    <>
      <Navbar
        onToggleSidebar={() => {
          if (isDesktop) {
            // Desktop: collapse/expand toggle (optional if you want burger visible on desktop)
            setSidebarCollapsed(!isSidebarCollapsed);
          } else {
            // Mobile: open/close toggle
            setSidebarOpen(!isSidebarOpen);
            setSidebarCollapsed(false); // ensure it's not stuck collapsed
          }
        }}
      />

      <div className="layout">
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={handleSidebarClose}
        />
        <main fetchPriority="high">{children}</main>
      </div>

      {/* Floating reopen button (desktop only) */}
      {/* &#9776 is the burger menu icon */}
      {isDesktop && isSidebarCollapsed && (
        <button className="show-sidebar-btn" onClick={handleSidebarReopen}>
          &#9776;
        </button>
      )}
    </>
  );
}
