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
    addTag,
    deleteTag,
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

  const handleSaveNoteContent = async () => {
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

  const handleClickNoteListItem =
    (noteID: string) => (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      switch (true) {
        case e.ctrlKey: {
          e.stopPropagation();
          handleDeleteNote(noteID);
          return;
        }
        case displayedNote?.noteID === noteID: {
          return;
        }
        default: {
          handleOpenNote(noteID);
          return;
        }
      }
    };

  const handleAddTag = (noteID: string) => async (title: string) => {
    console.log("handleaddtag fired");
    if (!/^[\w-]{1,}$/.test(title)) {
      console.log(`bad tag title ${title}`);
      return;
    }
    const res = await addTag(noteID, title);
    if (!res.success) {
      console.log(res.message);
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    await handleOpenNote(noteID);
  };

  const handleDeleteTag = async (tagID: string) => {
    const res = await deleteTag(tagID);
    if (!res.success) {
      console.log(res.message);
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    if (displayedNote === null) {
      return;
    }
    await handleOpenNote(displayedNote.noteID);
  };

  const handleTagClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    tag: api.Tag
  ) => {
    switch (true) {
      case e.shiftKey: {
        e.stopPropagation();
        setQuery((state) => {
          const newQuery = `${state} tag:#${tag.title} `;
          return newQuery.trimStart();
        });
        return;
      }
      case e.ctrlKey: {
        e.stopPropagation();
        handleDeleteTag(tag.tagID);
        return;
      }
    }
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
        <Allotment
          className="main-content"
          defaultSizes={sizes}
          onChange={setSizes}
        >
          <Allotment.Pane
            className="side-panel"
            minSize={300}
            visible={!isMobile}
          >
            <SearchBar
              query={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <NoteList
              notes={notes}
              displayedNoteID={displayedNote?.noteID}
              onNoteClick={handleClickNoteListItem}
              onNoteCreate={handleCreateNote}
              onSaveTitle={handleSaveNoteTitle}
              onSaveContent={handleSaveNoteContent}
            />
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
                onSave={handleAddTag(displayedNote.noteID)}
                onTagClick={handleTagClick}
              />
            )}
            <Markdown
              value={
                appState === "loading..." ? "" : displayedNote?.content || ""
              }
              onChange={(value) => {
                setDisplayedNote((note) =>
                  note === null
                    ? note
                    : {
                        ...note,
                        content: value ?? "",
                      }
                );
              }}
              preview={displayedNote === null ? "preview" : "edit"}
              hideToolbar={displayedNote === null}
              style={{
                cursor: displayedNote === null ? "pointer" : "initial",
              }}
            />
          </Allotment.Pane>
        </Allotment>
      </main>
    </>
  );
}

interface SearchBarProps {
  query?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={query}
        onChange={onChange}
      />
    </div>
  );
}

interface NoteListProps {
  notes?: api.NoteMeta[];
  displayedNoteID?: string;
  onNoteClick?: (noteID: string) => React.MouseEventHandler<HTMLLIElement>;
  onNoteCreate?: () => any;
  onSaveTitle?: (props: OnSaveProps) => any;
  onSaveContent?: () => any;
}

function NoteList({
  notes,
  displayedNoteID,
  onNoteClick,
  onNoteCreate,
  onSaveTitle,
  onSaveContent,
}: NoteListProps) {
  return (
    <>
      <div className="note-list-header">
        <span>Notes</span>
        <button className="button small" onClick={onNoteCreate}>
          +
        </button>
      </div>
      <ul className="note-list">
        {notes?.map((note) => (
          <li
            key={note.noteID}
            className={cn("note-list-item", {
              active: note.noteID === displayedNoteID,
            })}
            onClickCapture={onNoteClick?.(note.noteID)}
          >
            <EditableText
              readonly={note.noteID !== displayedNoteID}
              defaultValue={note.title}
              onSave={onSaveTitle}
              className="note-list-item-title"
            />
          </li>
        ))}
      </ul>
      <button
        className="button save-button"
        onClick={onSaveContent}
        disabled={displayedNoteID === null}
      >
        Save
      </button>
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
          onClickCapture={(e) => onTagClick?.(e, tag)}
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
              console.log("on save fired");
              setShowNewTag(false);
              onSave?.(value);
            }}
          />
        </li>
      )}
      <button
        className="button small"
        onClick={() => setShowNewTag((state) => !state)}
      >
        {showNewTag ? "-" : "+"}
      </button>
    </ul>
  );
}
