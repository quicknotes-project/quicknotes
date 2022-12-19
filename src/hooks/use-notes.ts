import { useEffect, useState } from "react";
import * as api from "../services/backend";
import { makeSuccessful, Optional } from "../utils/Optional";

function parseQuery(query: string): api.FindQueryParams {
  const tags = [...query.matchAll(/tag:#(\w*)/g)].map((match) => match[1]);

  const title = query.replaceAll(/\s*tag:#\w*\s*/g, " ");

  console.log("query: ", { title, tags });

  return { title, tags };
}

export default function useNotes() {
  const [notes, setNotes] = useState<api.NoteMeta[]>([]);

  const [tags, setTags] = useState<api.Tag[]>([]);

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

  const fetchTags = async () => {
    const res = await api.tag.getAll();

    if (!res.success) {
      // handle error
      console.log(res.message);
      return;
    }

    const tags = res.value;

    setTags(tags);
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

  const addTag = async (noteID: string, title: string) => {
    const res = await api.note.addTag(noteID, title);
    if (res.success) {
      await fetchTags();
    }
    return res;
  };

  const updateTag = async (noteID: string, tagID: string, title: string) => {
    const res = await api.note.editTag(noteID, tagID, title);
    if (res.success) {
      await fetchTags();
    }
    return res;
  };

  const deleteTag = async (noteID: string, tagID: string) => {
    const res = await api.note.deleteTag(noteID, tagID);
    if (res.success) {
      await fetchTags();
    }
    return res;
  };

  const updateTagGlobal = async (tagID: string, title: string) => {
    const res = await api.tag.edit({ tagID, title });
    if (res.success) {
      await fetchTags();
    }
    return res;
  };

  const deleteTagGlobal = async (tagID: string) => {
    const res = await api.tag.delete(tagID);
    if (res.success) {
      await fetchTags();
    }
    return res;
  };

  useEffect(() => {
    fetchNotes();
  }, [query]);

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, []);

  return {
    notes,
    getNote: api.note.get,
    createNote,
    updateNote,
    deleteNote,
    addTag,
    updateTag,
    deleteTag,
    tags,
    updateTagGlobal,
    deleteTagGlobal,
    query,
    setQuery,
  };
}
