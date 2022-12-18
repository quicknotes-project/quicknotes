/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import useNotes from "./hooks/use-notes";
import * as api from "./services/backend";
import { cn, renderIf } from "./utils";
import { Maybe } from "./types";
import "./App.css";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { OnSaveProps } from "./components/ui/EditableText";
const EditableText = React.lazy(() => import("./components/ui/EditableText"));

const Markdown = React.lazy(() => import("./components/Markdown"));

type AppState = "" | "loading..." | "saving..." | "done!" | "error";

export default function App() {
  const { fullname, logout } = useAuth();

  const {
    notes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    query,
    setQuery,
  } = useNotes();

  const [displayedNote, setDisplayedNote] = useState<Maybe<api.Note>>(null);

  const [appState, setAppState] = useState<AppState>("");

  const [sizes, setSizes] = useState([3, 7]);

  const isMobile = window.innerWidth <= 500;

  const handleCreateNote = async () => {
    const res = await createNote();
    if (!res.success) {
      console.log(res.message);
      return;
    }
    setDisplayedNote(res.value);
  };

  const handleUpdateNote = async (updates: api.NoteUpdate) => {
    if (!displayedNote) {
      return;
    }
    setAppState("saving...");
    const res = await updateNote(displayedNote.noteID, updates);
    if (!res.success) {
      console.log(res.message);
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    setAppState("done!");
    setTimeout(() => setAppState(""), 750);
  };

  const handleSaveNoteTitle = async ({ value, previousValue }: OnSaveProps) => {
    if (displayedNote === null || previousValue === value) {
      return;
    }
    handleUpdateNote({ title: value });
  };

  const handleSaveContent = async () => {
    handleUpdateNote({ content: displayedNote?.content });
  };

  const handleOpenNote = async (noteID: string) => {
    setAppState("loading...");
    const res = await getNote(noteID);
    if (!res.success) {
      console.log(res.message);
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    setDisplayedNote(res.value);
    setAppState("done!");
    setTimeout(() => setAppState(""), 750);
  };

  const handleDeleteNote = async (noteID: string) => {
    setAppState("loading...");
    const res = await deleteNote(noteID);
    if (!res.success) {
      console.log(res.message);
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    if (displayedNote?.noteID === noteID) {
      setDisplayedNote(null);
    }
    setAppState("done!");
    setTimeout(() => setAppState(""), 750);
  };

  const handleAddTag = async (title: string) => {};

  const handleTagClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    tag: api.Tag
  ) => {
    if (!e.ctrlKey) {
      return;
    }
    setQuery((state) => {
      const newQuery = `${state} tag:#${tag.title} `;
      return newQuery.trimStart();
    });
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-left">
            <h3 className="logo">Quicknotes</h3>
            <span className="display-state">{appState}</span>
          </div>
          <div>
            logged in as {fullname}{" "}
            <button className="button" onClick={logout}>
              logout
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="main-content">
          <Allotment defaultSizes={sizes} onChange={setSizes}>
            <Allotment.Pane minSize={300} visible={!isMobile}>
              <ul className="note-list">
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="note-list-header">
                  <span>Notes</span>
                  <button className="button" onClick={handleCreateNote}>
                    +
                  </button>
                </div>
                {notes.map((note) => (
                  <li
                    key={note.noteID}
                    className={cn("note-list-item", {
                      active: note.noteID === displayedNote?.noteID,
                    })}
                    onClick={(e) => {
                      if (e.ctrlKey) {
                        handleDeleteNote(note.noteID);
                        return;
                      }
                      if (displayedNote?.noteID === note.noteID) {
                        return;
                      }
                      handleOpenNote(note.noteID);
                    }}
                  >
                    <EditableText
                      readonly={note.noteID !== displayedNote?.noteID}
                      defaultValue={note.title}
                      onSave={handleSaveNoteTitle}
                      className="note-list-item-title"
                    />
                  </li>
                ))}
                <button
                  className="button"
                  style={{
                    width: "100%",
                    marginTop: ".5em",
                  }}
                  onClick={handleSaveContent}
                  disabled={displayedNote === null}
                >
                  Save
                </button>
              </ul>
            </Allotment.Pane>

            <Allotment.Pane minSize={300}>
              <div
                className="note-title-wrapper"
                onClick={displayedNote === null ? handleCreateNote : undefined}
                style={{ cursor: "pointer" }}
              >
                <EditableText
                  readonly={displayedNote === null}
                  defaultValue={
                    notes.find(({ noteID }) => noteID === displayedNote?.noteID)
                      ?.title || "New note..."
                  }
                  className={cn("note-title", {
                    placeholder: displayedNote === null,
                  })}
                  onSave={handleSaveNoteTitle}
                />
              </div>
              {displayedNote && (
                <TagList
                  key={displayedNote.noteID}
                  tags={displayedNote.tags}
                  onSave={handleAddTag}
                  onTagClick={handleTagClick}
                />
              )}
              <Markdown
                value={
                  appState === "loading..." ? "" : displayedNote?.content || ""
                }
                onChange={(value) => {
                  setDisplayedNote((note) => {
                    if (note === null) {
                      return note;
                    }
                    return {
                      ...note,
                      content: value ?? "",
                    };
                  });
                }}
                preview={displayedNote === null ? "preview" : "edit"}
                hideToolbar={displayedNote === null}
                style={{
                  cursor: displayedNote === null ? "pointer" : "initial",
                }}
              />
            </Allotment.Pane>
          </Allotment>
        </div>
      </main>
    </>
  );
}

export interface TagListProps {
  tags: api.Tag[];
  onUpdate?: (tagID: string, title: string) => any;
  onSave?: (title: string) => any;
  onTagClick?: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    tag: api.Tag
  ) => any;
}

function TagList({ tags, onUpdate, onSave, onTagClick }: TagListProps) {
  const [showNewTag, setShowNewTag] = useState(false);

  return (
    <ul className="note-tag-list">
      {tags.map((tag) => (
        <li
          key={tag.tagID}
          className="note-tag"
          onClick={(e) => onTagClick?.(e, tag)}
        >
          <EditableText
            defaultValue={tag.title}
            onBlur={() => setShowNewTag(false)}
            onSave={({ value }) => {
              onUpdate?.(tag.tagID, value);
            }}
          />
        </li>
      ))}
      {renderIf(
        showNewTag,
        <li className="note-tag">
          <EditableText
            defaultValue="tag-title"
            onBlur={() => setShowNewTag(false)}
            onSave={({ value }) => {
              setShowNewTag(false);
              onSave?.(value);
            }}
          />
        </li>
      )}
      <button
        className="button"
        onClick={() => setShowNewTag((state) => !state)}
      >
        {showNewTag ? "-" : "+"}
      </button>
    </ul>
  );
}
