"use client";

import { Menu, Moon, NotebookPen, Pointer, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import AuthModal from "../AuthModal";
import styles from "./SidebarLayout.module.css";
import AddNoteModal from '../LearningNotes/AddNoteModal'

interface TopbarProps {
  onHamburgerClick?: () => void;
}

export default function Topbar({ onHamburgerClick }: TopbarProps) {
  const router = useRouter();
  const { user, authenticating } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const closeAddModal = () => {
    setIsAddNoteModalOpen(false);
  };

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span
            onClick={onHamburgerClick}
            className={styles.topbarHamburger}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </span>
          <h1 className={styles.topbarTitle}>LearningMate AI</h1>
        </div>

        <div className={styles.topbarRight}>
            {user && (
              <NotebookPen
              size={20}
              style={{ cursor: "pointer" }}
              onClick={()=> setIsAddNoteModalOpen(true)}
              />
            )}

          {/* Theme toggle button */}
          <span
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ cursor: "pointer" }}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </span>

          {/* Show auth buttons or user avatar based on auth state */}
          {!authenticating && (
            <>
              {user ? (
                <button
                  className={styles.userAvatarButton}
                  onClick={() => router.push('/settings/user')}
                  aria-label="User settings"
                >
                  {user.profile_img ? (
                    <img
                      src={user.profile_img}
                      alt={user.name || user.email || "User"}
                      className={styles.userAvatar}
                    />
                  ) : (
                    <div className={styles.userAvatarPlaceholder}>
                      <User size={20} />
                    </div>
                  )}
                </button>
              ) : (
                <>
                  <button
                    className={`${styles.topbarButton} ${styles.login}`}
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Login
                  </button>
                  <button
                    className={`${styles.topbarButton} ${styles.signup}`}
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Signup
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* add note modal  */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={closeAddModal}
        editingNote={null}
      />

    </>
  );
}