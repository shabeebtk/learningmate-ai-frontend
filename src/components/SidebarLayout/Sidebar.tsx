"use client";
import { useState, useEffect } from "react";
import { Settings, X, Compass, Layers, BookOpen, CreditCard, Users, BookMinus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SidebarLayout.module.css";

interface SidebarProps {
    isOpen?: boolean;
    onToggle?: (open: boolean) => void;
}

export default function Sidebar({ isOpen: externalIsOpen, onToggle }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(externalIsOpen ?? true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { path: "/learn", icon: Compass, label: "Discover" },
        { path: "/learn/categories", icon: Layers, label: "Categories" },
        { path: "/learn/topics", icon: BookOpen, label: "Topics" },
        { path: "/characters", icon: Users, label: "Characters" },
        { path: "/learn/notes", icon: BookMinus, label: "My Notes" },
        { path: "/learn/settings", icon: Settings, label: "Settings" },

        { path: "#", icon: CreditCard, label: "Subscription", disabled: true },
    ];

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
            onToggle?.(false);
        }
    }, [pathname]);

    useEffect(() => {
        if (externalIsOpen !== undefined) setIsOpen(externalIsOpen);
    }, [externalIsOpen]);

    const handleToggle = () => {
        const newOpen = !isOpen;
        setIsOpen(newOpen);
        onToggle?.(newOpen);
    };

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className={`${styles.mobileOverlay} ${isOpen ? styles.visible : ""}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`${styles.sidebar} ${isMobile ? styles.mobile : styles.desktop
                    } ${isOpen ? styles.open : styles.closed}`}
            >
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogoSection}>
                        <div className={styles.sidebarLogo}>A</div>
                        {isOpen && <span className={styles.sidebarLogoText}>App</span>}
                    </div>
                    {isMobile && isOpen && (
                        <button
                            onClick={handleToggle}
                            className={styles.sidebarToggleButton}
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map(({ path, icon: Icon, label, disabled }) => (
                        disabled ? (
                            <div
                                key={label}
                                className={`${styles.navLink} ${styles.disabledLink}`}
                                title="Coming soon"
                            >
                                <div className={`${styles.navIconWrapper} ${!isOpen ? styles.closedIcon : ""}`}>
                                    <Icon size={20} className={styles.navIcon} />
                                </div>
                                {isOpen && <span className={styles.navLabel}>{label}</span>}
                            </div>
                        ) : (
                            <Link
                                key={path}
                                href={path}
                                className={`${styles.navLink} ${pathname === path ? styles.active : ""}`}
                            >
                                <div className={`${styles.navIconWrapper} ${!isOpen ? styles.closedIcon : ""}`}>
                                    <Icon size={20} className={styles.navIcon} />
                                </div>
                                {isOpen && <span className={styles.navLabel}>{label}</span>}
                            </Link>
                        )
                    ))}

                </nav>
            </div>
        </>
    );
}
