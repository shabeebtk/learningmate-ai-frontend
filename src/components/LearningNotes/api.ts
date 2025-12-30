// API functions for notes

export type Note = {
  id: number;
  title: string;
  content: string;
  is_starred: boolean;
  created_at: string;
};

export type CreateNoteData = {
  title: string;
  content: string;
};

export type UpdateNoteData = {
  title?: string;
  content?: string;
  is_starred?: boolean;
};

// Fetch all notes
export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch("/api/learn/notes/list", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch notes");

  return data.data;
}

// Create a new note
export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const res = await fetch("/api/learn/notes/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to create note");

  return data.data;
}

// Update a note
export async function updateNote(noteId: number, noteData: UpdateNoteData): Promise<Note> {
  const res = await fetch(`/api/learn/notes/${noteId}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to update note");

  return data.data;
}

// Delete a note
export async function deleteNote(noteId: number): Promise<void> {
  const res = await fetch(`/api/learn/notes/${noteId}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to delete note");
}