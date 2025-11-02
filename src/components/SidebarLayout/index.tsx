"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./SidebarLayout.module.css";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHamburgerClick = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className={styles.layoutRight}>
        <Topbar onHamburgerClick={handleHamburgerClick} />
        <main className={styles.layoutMain}>{children}</main>
      </div>
    </div>
  );
}
