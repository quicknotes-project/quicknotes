/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import * as api from './services/backend';
import { cn } from './utils';
import { Maybe } from './types';
import 'allotment/dist/style.css';
import './App.css';

import { Allotment } from 'allotment';
import useNotes from './hooks/use-notes';

const Markdown = React.lazy(() => import('./components/Markdown'));

type NoteState = '' | 'loading...' | 'saving...' | 'saved!' | 'error';

export default function App() {
  const { fullname, logout } = useAuth();

  const { notes, createNote } = useNotes();

  const [displayedNoteID, setDisplayedNoteID] = useState<Maybe<string>>(null);

  const [content, setContent] = useState<string>('');

  const [displayedNoteState, setDisplayedNoteState] = useState<NoteState>('');

  const [sizes, setSizes] = useState([3, 7]);

  const saveContent = async () => {
    setDisplayedNoteState('saving...');
    if (!displayedNoteID) {
      console.log('tried to save note but no note selected!');
      // handle error?
      return;
    }
    const res = await api.note.update(displayedNoteID, { content });
    if (!res.success) {
      console.log('could not update note content!');
      setDisplayedNoteState('error');
      // handle error?
      return;
    }
    setDisplayedNoteState('saved!');
  };

  const handleCreateNote = async () => {
    const res = await createNote();
    if (!res.success) {
      console.log(res.message);
      return;
    }
    setDisplayedNoteID(res.value);
  };

  return (
    <>
      <header>
        <div className="header-content">
          <h3 className="logo">Quicknotes</h3>
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
            <Allotment.Pane minSize={150}>
              <ul className="note-list">
                <div className="note-list-header">
                  <span>Notes</span>
                  <button className="button" onClick={handleCreateNote}>
                    +
                  </button>
                </div>
                {notes.map((note) => (
                  <li
                    key={note.noteID}
                    className={cn({
                      active: note.noteID === displayedNoteID,
                    })}
                    data-state={displayedNoteState}
                    onClick={async () => {
                      setDisplayedNoteID(note.noteID);
                      setDisplayedNoteState('loading...');
                      const res = await api.note.fetch(note.noteID);
                      setDisplayedNoteState('');
                      if (!res.success) {
                        console.log(res.message);
                        return;
                      }
                      setContent(res.value.content);
                    }}
                  >
                    {note.title}
                  </li>
                ))}
              </ul>
            </Allotment.Pane>

            <Allotment.Pane minSize={200}>
              <Markdown
                value={content || ''}
                onChange={(value) => setContent(value ?? '')}
                preview="edit"                
              />
            </Allotment.Pane>
          </Allotment>
        </div>
      </main>
    </>
  );
}
