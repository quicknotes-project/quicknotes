/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import useNotes from "./hooks/use-notes";
import * as api from "./services/backend";
import { cn, renderIf } from "./utils";
import { Maybe } from "./types";
import "./App.css";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { OnSaveProps } from "./components/ui/EditableText";
import { useAppState } from "./contexts/AppContext";
const EditableText = React.lazy(() => import("./components/ui/EditableText"));

const Markdown = React.lazy(() => import("./components/Markdown"));

export default function App() {
  const {
    notes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    addTag,
    updateTag,
    deleteTag,
    query,
    setQuery,
    tags,
    updateTagGlobal,
    deleteTagGlobal,
  } = useNotes();

  const [displayedNote, setDisplayedNote] = useState<Maybe<api.Note>>(null);

  const { appState, setAppState } = useAppState();

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

  const handleAddNoteTag = (noteID: string) => async (title: string) => {
    console.log("add note tag fired");

    if (/\#/.test(title)) {
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
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

  const handleUpdateNoteTag =
    (noteID: string) => async (tagID: string, title: string) => {
      setAppState("loading...");
      const res = await updateTag(noteID, tagID, title);
      if (!res.success) {
        console.log(res.message);
        setAppState("error");
        setTimeout(() => setAppState(""), 750);
        return;
      }
      setAppState("done!");
      setTimeout(() => setAppState(""), 750);
      await handleOpenNote(noteID);
    };

  const handleDeleteNoteTag = (noteID: string) => async (tagID: string) => {
    setAppState("loading...");
    const res = await deleteTag(noteID, tagID);
    if (!res.success) {
      console.log(res.message);
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    setAppState("done!");
    setTimeout(() => setAppState(""), 750);
    await handleOpenNote(noteID);
  };

  const handleNoteTagClick = (
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
        handleDeleteNoteTag(tag.tagID);
        return;
      }
    }
  };

  const handleTagClick =
    (tag: api.Tag) => (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      switch (true) {
        case e.shiftKey: {
          return;
        }
        default: {
          e.stopPropagation();
          setQuery((state) => {
            const newQuery = `${state} tag:#${tag.title} `;
            return newQuery.trimStart();
          });
          return;
        }
      }
    };

  const handleTagSave = async (tagID: string, { value }: OnSaveProps) => {
    if (value === "") {
      setAppState("loading...");
      const res = await deleteTagGlobal(tagID);
      if (!res.success) {
        setAppState("error");
        setTimeout(() => setAppState(""), 750);
        return;
      }
      setAppState("done!");
      setTimeout(() => setAppState(""), 750);
      return;
    }

    setAppState("loading...");
    const res = await updateTagGlobal(tagID, value);
    if (!res.success) {
      setAppState("error");
      setTimeout(() => setAppState(""), 750);
      return;
    }
    setAppState("done!");
    setTimeout(() => setAppState(""), 750);
  };

  return (
    <>
      <main className="app">
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
            <Allotment
              className="side-panel-upper"
              defaultSizes={[7, 3]}
              vertical
            >
              <Allotment.Pane>
                <NoteList
                  notes={notes}
                  displayedNoteID={displayedNote?.noteID}
                  onNoteClick={handleClickNoteListItem}
                  onNoteCreate={handleCreateNote}
                  onSaveTitle={handleSaveNoteTitle}
                  onSaveContent={handleSaveNoteContent}
                />
              </Allotment.Pane>
              <Allotment.Pane>
                <TagList
                  tags={tags}
                  onClick={handleTagClick}
                  onSave={handleTagSave}
                />
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>

          <Allotment.Pane minSize={300}>
            <div
              className="note-title-wrapper"
              onClick={displayedNote === null ? handleCreateNote : undefined}
              style={{ cursor: "pointer" }}
            >
              <EditableText
                readonly={displayedNote === null}
                defaultValue={displayedNote?.title || "New note..."}
                className={cn("note-title", {
                  placeholder: displayedNote === null,
                })}
                onSave={handleSaveNoteTitle}
              />
              {renderIf(
                displayedNote !== null,
                <button
                  className="button icon"
                  onClick={() => {
                    if (displayedNote === null) {
                      return;
                    }
                    handleDeleteNote(displayedNote.noteID);
                  }}
                >
                  del
                </button>
              )}
            </div>
            {displayedNote && (
              <NoteTagList
                key={displayedNote.noteID}
                tags={displayedNote.tags}
                onAdd={handleAddNoteTag(displayedNote.noteID)}
                onUpdate={handleUpdateNoteTag(displayedNote.noteID)}
                onDelete={handleDeleteNoteTag(displayedNote.noteID)}
                onTagClick={handleNoteTagClick}
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
        className="input search-bar"
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
    <div className="list-wrapper">
      <div className="list-header">
        <span>Notes</span>
        <button className="button small" onClick={onNoteCreate}>
          +
        </button>
      </div>
      <ul className="list">
        {notes?.map((note) => (
          <li
            key={note.noteID}
            className={cn("list-item", {
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
      <div className="save-button-wrapper">
        <button
          className="button save-button"
          onClick={onSaveContent}
          disabled={displayedNoteID === undefined}
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface TagListProps {
  tags: api.Tag[];
  onClick?: (tag: api.Tag) => React.MouseEventHandler<HTMLLIElement>;
  onSave?: (tagID: string, props: OnSaveProps) => any;
}

function TagList({ tags, onClick, onSave }: TagListProps) {
  return (
    <div className="list-wrapper">
      <div className="list-header">
        <span>Tags</span>
      </div>
      <ul className="list">
        {tags.map((tag) => (
          <li
            key={tag.tagID}
            className="list-item"
            onClickCapture={onClick?.(tag)}
          >
            <EditableText
              defaultValue={tag.title}
              onSave={(props) => onSave?.(tag.tagID, props)}
              className="note-list-item-title"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface NoteTagListProps {
  tags: api.Tag[];
  onUpdate?: (tagID: string, title: string) => any;
  onAdd?: (title: string) => Promise<any>;
  onDelete?: (tagID: string) => any;
  onTagClick?: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    tag: api.Tag
  ) => any;
}

function NoteTagList({
  tags,
  onUpdate,
  onAdd,
  onDelete,
  onTagClick,
}: NoteTagListProps) {
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
              if (value.trim() === "") {
                onDelete?.(tag.tagID);
                return;
              }
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
              onAdd?.(value).then(() => setShowNewTag(false));
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
