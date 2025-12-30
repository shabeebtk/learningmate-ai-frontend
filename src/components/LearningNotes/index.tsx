'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Loader2,
  BookmarkPlus,
  Search,
  Calendar,
  Eye,
  BookOpen
} from "lucide-react";
import { fetchNotes, updateNote, deleteNote, Note } from "./api";
import AddNoteModal from "./AddNoteModal";
import ViewNoteModal from "./ViewNoteModal";
import styles from "./style.module.css";

function Notes() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: ({ id, is_starred }: { id: number; is_starred: boolean }) =>
      updateNote(id, { is_starred }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const openAddModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
    } else {
      setEditingNote(null);
    }
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingNote(null);
  };

  const openViewModal = (note: Note) => {
    setViewingNote(note);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingNote(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStar = (id: number, currentStarred: boolean) => {
    toggleStarMutation.mutate({ id, is_starred: !currentStarred });
  };

  // Filter notes based on search
  const filteredNotes = notes.filter(
    (note: any) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: starred first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.is_starred && !b.is_starred) return -1;
    if (!a.is_starred && b.is_starred) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>

        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <BookOpen className={styles.headerIcon} />
            <h2 className={styles.heading}>Notes</h2>
          </div>
          <p className={styles.subtitle}>Discover topics that inspire your learning journey</p>
        </div>

      </div>

      <div className={styles.ActionHeader}>

        <button onClick={() => openAddModal()} className={styles.addButton}>
          <Plus size={20} />
          Add Note
        </button>
      </div>


      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBox}
        />
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p>Loading notes...</p>
        </div>
      ) : sortedNotes.length === 0 ? (
        <div className={styles.emptyState}>
          <BookmarkPlus className={styles.emptyIcon} />
          <p className={styles.emptyText}>
            {searchQuery ? "No notes found" : "No notes yet"}
          </p>
          <p className={styles.emptyHint}>
            {searchQuery ? "Try a different search term" : "Click 'Add Note' to create your first note"}
          </p>
        </div>
      ) : (
        <div className={styles.notesGrid}>
          {sortedNotes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <button
                  onClick={() => handleToggleStar(note.id, note.is_starred)}
                  className={`${styles.starButton} ${note.is_starred ? styles.starred : ""}`}
                  aria-label={note.is_starred ? "Unstar note" : "Star note"}
                >
                  <Star size={18} />
                </button>
              </div>

              <p className={styles.noteContent}>{note.content}</p>

              <div className={styles.noteFooter}>
                <div className={styles.noteDate}>
                  <Calendar size={14} />
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
                <div className={styles.noteActions}>
                  <button
                    onClick={() => openViewModal(note)}
                    className={styles.viewButton}
                    aria-label="View note"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openAddModal(note)}
                    className={styles.editButton}
                    aria-label="Edit note"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className={styles.deleteButton}
                    disabled={deleteMutation.isPending}
                    aria-label="Delete note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        editingNote={editingNote}
      />

      <ViewNoteModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        note={viewingNote}
      />
    </div>
  );
}

export default Notes;