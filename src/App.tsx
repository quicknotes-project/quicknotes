/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import useNotes from './hooks/use-notes';
import * as api from './services/backend';
import { cn } from './utils';
import './App.css';

import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { OnSaveProps } from './components/ui/EditableText';
const EditableText = React.lazy(() => import('./components/ui/EditableText'));
const Markdown = React.lazy(() => import('./components/Markdown'));

type AppState = '' | 'loading...' | 'saving...' | 'saved!' | 'error';

export default function App() {
  const { fullname, logout } = useAuth();

  const { notes, createNote, updateNote, fetchNotes } = useNotes();

  const [displayedNoteID, setDisplayedNoteID] = useState<string | null>(null);

  const [content, setContent] = useState<string>('');

  const [appState, setAppState] = useState<AppState>('');

  const [sizes, setSizes] = useState([3, 7]);

  const handleCreateNote = async () => {
    const res = await createNote();
    if (!res.success) {
      console.log(res.message);
      return;
    }
    setDisplayedNoteID(res.value);
  };

  const handleUpdateNote = async (noteID: string, updates: api.NoteUpdate) => {
    setAppState('saving...');
    const res = await updateNote(noteID, updates);
    if (!res.success) {
      console.log(res.message);
      setAppState('error');
      setTimeout(() => setAppState(''), 750);
      return;
    }
    setAppState('saved!');
    setTimeout(() => setAppState(''), 750);
    await fetchNotes();
  };

  const handleSaveNoteTitle = async ({ value, previousValue }: OnSaveProps) => {
    if (displayedNoteID === null || previousValue === value) {
      return;
    }
    handleUpdateNote(displayedNoteID, { title: value });
  };

  const handleSaveContent = async () => {
    if (displayedNoteID === null) {
      return;
    }
    handleUpdateNote(displayedNoteID, { content });
  };

  const isMobile = window.innerWidth <= 500

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-left">
            <h3 className="logo">Quicknotes</h3>
            <span className="display-state">{appState}</span>
          </div>
          <div>
            logged in as {fullname}{' '}
            <button className="button" onClick={logout}>
              logout
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="main-content">
          <Allotment defaultSizes={sizes} onChange={setSizes}>
            <Allotment.Pane minSize={150} visible={!isMobile}>
              <ul className="note-list">
                <div className="note-list-header">
                  <span
                    onClick={() => {
                      setDisplayedNoteID(null);
                      setContent('');
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    Notes
                  </span>
                  <button className="button" onClick={handleCreateNote}>
                    +
                  </button>
                </div>
                {notes.map((note) => (
                  <li
                    key={note.noteID}
                    className={cn('note-list-item', {
                      active: note.noteID === displayedNoteID,
                    })}
                    onClick={async () => {
                      setDisplayedNoteID(note.noteID);
                      setAppState('loading...');
                      const res = await api.note.fetch(note.noteID);
                      setAppState('');
                      if (!res.success) {
                        console.log(res.message);
                        return;
                      }
                      setContent(res.value.content);
                    }}
                  >
                    <EditableText
                      readonly={note.noteID !== displayedNoteID}
                      defaultValue={note.title}
                      onSave={handleSaveNoteTitle}
                    />
                  </li>
                ))}
                <button
                  className="button"
                  style={{
                    width: '100%',
                    marginTop: '.5em',
                  }}
                  onClick={handleSaveContent}
                  disabled={displayedNoteID === null}
                >
                  Save
                </button>
              </ul>
            </Allotment.Pane>

            <Allotment.Pane minSize={200}>
              <div
                className="note-title-wrapper"
                style={{
                  // borderTop: '1px solid rgba(128, 128, 128, 0.35)',
                }}
              >
                <EditableText
                  readonly={displayedNoteID === null}
                  defaultValue={
                    notes.find(({ noteID }) => noteID === displayedNoteID)
                      ?.title || 'Nothing selected'
                  }
                  className={cn('note-title', {
                    placeholder: displayedNoteID === null,
                  })}
                  onSave={handleSaveNoteTitle}
                />
              </div>
              <Markdown
                value={content || ''}
                onChange={(value) => setContent(value ?? '')}
                preview="edit"
                hideToolbar={displayedNoteID === null}
              />
            </Allotment.Pane>
          </Allotment>
        </div>
      </main>
    </>
  );
}
