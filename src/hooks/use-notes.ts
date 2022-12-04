import { useEffect, useState } from "react";
import * as api from '../services/backend'
import { makeSuccessful, Optional } from "../utils/Optional";

export default function useNotes() {
  const [notes, setNotes] = useState<api.NoteMetadata[]>([]);

  const fetchNotes = async () => {
    const res = await api.note.list();
    if (!res.success) {
      console.log('could not fetch notes!');
      // handle error
      return;
    }
    const notes = res.value
    const sorted = notes
      .slice()
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    setNotes(sorted)
  };

  const createNote = async (): Promise<Optional<string>> => {
    const res = await api.note.create()
    if (!res.success) {
      return res
    }
    const note = res.value
    setNotes((state) => [note, ...state])
    return makeSuccessful(note.noteID)
  }

  const updateNote = async (noteID: string, updates: api.NoteUpdate): Promise<Optional<void>> => {
    return api.note.update(noteID, updates)
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, createNote, updateNote, fetchNotes }
}