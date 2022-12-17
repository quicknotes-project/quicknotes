import { useEffect, useState } from "react";
import * as api from "../services/backend";
import { makeSuccessful, Optional } from "../utils/Optional";

export default function useNotes() {
  const [notes, setNotes] = useState<api.NoteMeta[]>([]);

  const fetchNotes = async () => {
    const res = await api.note.getAll();
    if (!res.success) {
      // handle error
      console.log(res.message);
      return;
    }
    const notes = res.value;
    const sorted = notes
      .slice()
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    setNotes(sorted);
  };

  const getNote = async (noteID: string): Promise<Optional<api.Note>> => {
    return api.note.get(noteID);
  };

  const createNote = async (): Promise<Optional<api.Note>> => {
    const res = await api.note.create();
    if (!res.success) {
      return res;
    }
    const note = res.value;
    setNotes((state) => [note, ...state]);
    return makeSuccessful(note);
  };

  const updateNote = async (
    noteID: string,
    updates: api.NoteUpdate
  ): Promise<Optional<void>> => {
    return api.note.update(noteID, updates);
  };

  const deleteNote = async (noteID: string): Promise<Optional<void>> => {
    const res = await api.note.delete(noteID);
    if (!res.success) {
      return res;
    }
    await fetchNotes();
    return res;
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, fetchNotes, getNote, createNote, updateNote, deleteNote };
}
