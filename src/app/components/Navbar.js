"use client"; 
import { useState } from "react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="navbar">
      
        <div className="brand"><a href="/"><i className="fa fa-droplet"></i> Fluid Tracker</a></div>
      
      <button className="burger" onClick={onToggleSidebar}>
        &#9776;
      </button>
    </nav>
  );
}
