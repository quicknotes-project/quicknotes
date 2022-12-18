import { useEffect, useState } from "react";
import * as api from "../services/backend";
import { makeSuccessful, Optional } from "../utils/Optional";

function parseQuery(query: string): api.FindQueryParams {
  const tags = [...query.matchAll(/tag:#(\w*)/g)].map((match) => match[1]);

  const content = query.replaceAll(/\s*tag:#\w*\s*/g, " ");

  console.log("query: ", { content, tags });

  return { content, tags };
}

export default function useNotes() {
  const [notes, setNotes] = useState<api.NoteMeta[]>([]);

  const [query, setQuery] = useState<string>("");

  const fetchNotes = async () => {
    const res =
      query.trim() !== ""
        ? await api.find(parseQuery(query))
        : await api.note.getAll();

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

  const createNote = async (): Promise<Optional<api.Note>> => {
    const res = await api.note.create();
    if (!res.success) {
      return res;
    }
    await fetchNotes();
    return makeSuccessful(res.value);
  };

  const updateNote = async (
    noteID: string,
    updates: api.NoteUpdate
  ): Promise<Optional<void>> => {
    const res = await api.note.update(noteID, updates);
    if (res.success) {
      await fetchNotes();
    }
    return res;
  };

  const deleteNote = async (noteID: string): Promise<Optional<void>> => {
    const res = await api.note.delete(noteID);
    if (res.success) {
      await fetchNotes();
    }
    return res;
  };

  useEffect(() => {
    fetchNotes();
  }, [query]);

  return {
    notes,
    getNote: api.note.get,
    createNote,
    updateNote,
    deleteNote,
    query,
    setQuery,
    addTag: api.tag.add,
    editTag: api.tag.edit,
    deleteTag: api.tag.delete,
  };
}
