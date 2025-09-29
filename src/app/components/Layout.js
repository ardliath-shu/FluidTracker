"use client";
import { useState } from "react";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
	const isDesktop = useMediaQuery("(min-width: 992px)");

	const [isSidebarOpen, setSidebarOpen] = useState(false);       // mobile only
	const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop only

	const handleSidebarClose = () => {
		if (isDesktop) {
			setSidebarCollapsed(true);   // collapse on desktop
		} else {
			setSidebarOpen(false);       // close on mobile
		}
	};

	const handleSidebarReopen = () => {
		if (isDesktop) {
			setSidebarCollapsed(false);  // expand on desktop
		} else {
			setSidebarOpen(true);        // open on mobile
		}
	};

	// Handle dark-mode based on local storage
	//   if (typeof window !== "undefined") {
	//     const isDarkMode = localStorage.getItem("dark-mode") === "true";
	//     document.body.classList.toggle("dark-mode", isDarkMode);
	//   }
	// Fix as above causes hydration issues - move to useEffect in Navbar or Sidebar if needed


	// Margin for .main on desktop when sidebar is expanded/collapsed - mobile is always 0
	const marginLeft = isDesktop ? (isSidebarCollapsed ? 0 : 200) : 0

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

				<main style={{ marginLeft }} className="main">
					{children}
				</main>

				{/* <ExtraMenu /> */}
			</div>

			{/* Floating reopen button (desktop only) */}
			{isDesktop && isSidebarCollapsed && (
				<button
					className="show-sidebar-btn"
					onClick={handleSidebarReopen}
				>
					&#9776;
				</button>
			)}
		</>
	);
}
