"use client";

import { siteConfig } from "@/app/lib/site.config";
import Link from "next/link";

export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="navbar">
      <h1 className="brand">
        <Link href="/">
          <i className="fa fa-droplet"></i> {siteConfig.name}
        </Link>
      </h1>

      <button className="burger" onClick={onToggleSidebar}>
        &#9776; {/* burger menu icon */}
      </button>
    </nav>
  );
}
