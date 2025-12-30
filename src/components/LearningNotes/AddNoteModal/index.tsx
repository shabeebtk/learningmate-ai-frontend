'use client';

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { createNote, updateNote, Note } from "../api";
import styles from "./style.module.css";

type AddNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingNote?: Note | null;
};

function AddNoteModal({ isOpen, onClose, editingNote }: AddNoteModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote, isOpen]);

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      handleClose();
    },
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      handleClose();
    },
  });

  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      updateMutation.mutate({
        id: editingNote.id,
        data: { title: title.trim(), content: content.trim() },
      });
    } else {
      createMutation.mutate({ title: title.trim(), content: content.trim() });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {editingNote ? "Edit Note" : "Add New Note"}
          </h3>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className={styles.textarea}
              rows={8}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={handleClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={
                !title.trim() ||
                !content.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <Loader2 className={styles.buttonSpinner} />
                  Saving...
                </>
              ) : (
                <>{editingNote ? "Update Note" : "Create Note"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default AddNoteModal