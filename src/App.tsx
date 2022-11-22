import { useEffect, useState } from 'react';
import { Allotment } from 'allotment';
import Markdown from './components/Markdown';
import { useAuth } from './contexts/AuthContext';
import * as api from './services/backend';
import { cn } from './utils';
import { Maybe } from './types';
import 'allotment/dist/style.css';
import './App.css';

type NoteState = '' | 'loading...' | 'saving...' | 'saved!' | 'error';

export default function App() {
  const { fullname, logout } = useAuth();

  const [notes, setNotes] = useState<api.NoteMetadata[]>([]);

  const [currentNoteID, setCurrentNoteID] = useState<Maybe<string>>(null);

  const [content, setContent] = useState<string>('');

  const [currentNoteState, setCurrentNoteState] = useState<NoteState>('');

  const [sizes, setSizes] = useState([3, 7]);

  const saveContent = async () => {
    setCurrentNoteState('saving...');
    if (!currentNoteID) {
      console.log('tried to save note but no note selected!');
      // handle error?
      return;
    }
    const res = await api.note.update(currentNoteID, { content });
    if (!res.success) {
      console.log('could not update note content!');
      setCurrentNoteState('error');
      // handle error?
      return;
    }
    setCurrentNoteState('saved!');
  };

  const fetchNotes = async () => {
    const res = await api.note.list();
    console.log(res);
    if (!res.success) {
      console.log('could note fetch notes!');
      // handle error
      return;
    }
    setNotes(res.value);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

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
                  <button className="button">+</button>
                </div>
                {notes.map((note) => (
                  <li
                    key={note.noteID}
                    className={cn({
                      active: note.noteID === currentNoteID,
                    })}
                    data-state={currentNoteState}
                    onClick={async () => {
                      setCurrentNoteID(note.noteID);
                      setCurrentNoteState('loading...');
                      // setLoadingContent(true);
                      const res = await api.note.fetch(note.noteID);
                      // setLoadingContent(false);
                      setCurrentNoteState('');
                      console.log(res);
                      if (!res.success) {
                        // handle error
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
              />
            </Allotment.Pane>
          </Allotment>
        </div>
      </main>
    </>
  );
}
