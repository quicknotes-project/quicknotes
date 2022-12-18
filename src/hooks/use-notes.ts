import { useEffect, useState } from "react";
import * as api from "../services/backend";
import { makeSuccessful, Optional } from "../utils/Optional";

function parseQuery(query: string): api.FindQueryParams {
  const tags = [...query.matchAll(/tag:#(\w*)/g)].map((match) => match[1]);

  const content = query.replaceAll(/tag:#\w*\s/g, "");

  return { content, tags };
}

export default function useNotes() {
  const [notes, setNotes] = useState<api.NoteMeta[]>([]);

  const [query, setQuery] = useState<string>("");

  const fetchNotes = async () => {
    console.log(`fetching notes, query: ${query}`);

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
    const res = await api.note.update(noteID, updates);
    if (res.success) {
      await fetchNotes();
    }
    return res;
  };

  const deleteNote = async (noteID: string): Promise<Optional<void>> => {
    const res = await api.note.delete(noteID);
    if (!res.success) {
      return res;
    }
    await fetchNotes();
    return res;
  };

  const addTag = async (
    noteID: string,
    title: string
  ): Promise<Optional<void>> => {
    return api.tag.add(noteID, title);
  };

  const editTag = async (tag: api.Tag): Promise<Optional<void>> => {
    return api.tag.edit(tag);
  };

  const deleteTag = async (tagID: string): Promise<Optional<void>> => {
    return api.tag.delete(tagID);
  };

  useEffect(() => {
    fetchNotes();
  }, [query]);

  return {
    notes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    query,
    setQuery,
    addTag,
    editTag,
    deleteTag,
  };
}
