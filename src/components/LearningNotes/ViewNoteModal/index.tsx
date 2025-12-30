'use client';

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Note } from "../api";
import styles from "./style.module.css";

type ViewNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
};

export default function ViewNoteModal({
  isOpen,
  onClose,
  note,
}: ViewNoteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !note) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // optional toast later
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{note.title}</h3>

          <div className={styles.headerActions}>
            <button
              onClick={handleCopy}
              className={styles.copyButton}
              aria-label="Copy note"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>

            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.viewBody}>
          <p className={styles.viewText}>{note.content}</p>
        </div>
      </div>
    </div>
  );
}
