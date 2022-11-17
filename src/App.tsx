import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { note, NoteMetadata } from './services/backend';
import { Allotment } from 'allotment';
import Markdown from './components/Markdown';
import './App.css';
import 'allotment/dist/style.css';

export default function App() {
  const { fullname, signout } = useAuth();

  const [notes, setNotes] = useState<NoteMetadata[]>([]);

  const [content, setContent] = useState<string | undefined>('');

  const [sizes, setSizes] = useState([3, 7]);

  useEffect(() => {
    (async () => {
      const res = await note.list();
      if (!res.success) {
        // handle error
        return;
      }
      setNotes(res.value);
    })();
  }, []);

  return (
    <>
      <header>
        <div className="header-content">
          <h3 className="logo">Quicknotes</h3>
          <div>
            logged in as {fullname}{' '}
            <button className="button" onClick={signout}>
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
                  <li>{note.title}</li>
                ))}
              </ul>
            </Allotment.Pane>

            <Markdown
              value={content || ''}
              onChange={(value) => setContent(value)}
            />
          </Allotment>
        </div>
      </main>
    </>
  );
}
