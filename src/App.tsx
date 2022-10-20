import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Tag from './components/Tag';
import Modal from './components/Modal';
import Note from './components/Note';
import Toggle from './components/Toggle';
import Editable from './components/Editable';
import ToolBar from './components/ToolBar';
import SideBar from './components/SideBar';
import SearchBar from './components/SearchBar';
import InlineForm from './components/InlineForm';
import { cn, generateRandomColor, renderIf, safeJSONParse } from './utils';
import { handleOption } from './utils/Optional';
import './styles/App.css';

const listNames = ['notes', 'tags'] as const;

type ListNames = typeof listNames[number];

interface TagData {
  title: string;
  color: string;
}

function NewTag(title: string, color: string): TagData {
  return { title, color };
}

interface NoteData {
  title: string;
  text: string;
  tags: TagData[];
  createdAt: Date;
  modifiedAt: Date;
}

function isNoteData(value: any): value is NoteData {
  return (
    'title' in value &&
    'text' in value &&
    'tags' in value &&
    'createdAt' in value &&
    'modifiedAt' in value
  );
}

function isNoteDataArray(value: any): value is NoteData[] {
  return Array.isArray(value) && value.every(isNoteData);
}

function NewNoteData(
  title: string,
  text: string,
  tags?: TagData[],
  createdAt?: Date,
  modifiedAt?: Date
): NoteData {
  return {
    title,
    text,
    tags: tags ?? [],
    createdAt: createdAt ?? new Date(),
    modifiedAt: modifiedAt ?? new Date(),
  };
}

const mockTags = {
  cool: NewTag('cool', '#AFBC9A'),
  awesome: NewTag('awesome', '#8CACB6'),
  wow: NewTag('wow', generateRandomColor()),
  nice: NewTag('nice', generateRandomColor()),
  smth: NewTag('smth', generateRandomColor()),
} as const;

const mockNotes: NoteData[] = [
  NewNoteData(
    'school',
    'hahaha i love school '.repeat(48),
    [mockTags.cool, mockTags.awesome],
    new Date(Date.parse('2022-10-01')),
    new Date(Date.parse('2022-10-01'))
  ),
  NewNoteData(
    'foo',
    'bar',
    [mockTags.cool, mockTags.awesome, mockTags.awesome, mockTags.awesome],
    new Date(Date.parse('2022-09-30')),
    new Date(Date.parse('2022-09-30'))
  ),
  NewNoteData('something', 'something', [mockTags.nice, mockTags.wow]),
  NewNoteData('', 'something'),
  NewNoteData('something', 'something'),
  NewNoteData('something', 'something'),
  NewNoteData('something', 'something'),
  NewNoteData('something', 'something'),
  NewNoteData('something', 'something'),
  NewNoteData('something', 'something'),
];

export default function App() {
  const { signout, fullname } = useAuth();

  const [currentNoteID, setCurrentNoteID] = useState<number>(-1);
  const [activeListName, setActiveList] = useState<ListNames>('notes');

  const [notes, setNotes] = useState<NoteData[]>(mockNotes);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const [showNewTag, setShowNewTag] = useState(false);

  // const [searchTags, setSearchTags] = useState<Tag[]>();

  const tags = notes
    .map((note) => note.tags)
    .flat()
    .filter(
      // will be unnecessary
      (tag, index, arr) =>
        !arr.some((t, i) => tag.title === t.title && index > i)
    );

  const getCurrentNote = () =>
    currentNoteID < 0 ? null : notes[currentNoteID];

  const updateCurrentNote = (transform: (prev: NoteData) => NoteData) => {
    setNotes((state) => {
      const prev = state.find((_, i) => i === currentNoteID);
      return prev
        ? state.map((n, i) => (i === currentNoteID ? transform(prev) : n))
        : state;
    });
  };

  const prependNotes = (note: NoteData) => {
    setNotes((state) => [note, ...state]);
  };

  const deleteNote = (index: number) => {
    setNotes((state) => state.filter((_, i) => i !== index));
  };

  const fetchData = async () => {
    const res = await fetch('/notes');

    if (res.status !== 200) return;

    const raw = await res.json();
    const notesOption = safeJSONParse(isNoteDataArray)(raw);

    handleOption(setNotes, () => {})(notesOption);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <ToolBar>
        <ToolBar.Controls>
          <button
            className="button"
            onClick={() => {
              prependNotes(
                NewNoteData('New note', '', [], new Date(), new Date())
              );
              setCurrentNoteID(0);
            }}
          >
            New
          </button>
        </ToolBar.Controls>
        <ToolBar.UserInfo>
          Signed in as{' '}
          <ToolBar.UserInfo.UserName
            value={fullname ?? '-'}
            className="link accent"
            onClick={() => {
              setShowUserModal(true);
            }}
          />
        </ToolBar.UserInfo>
      </ToolBar>

      <main className="app">
        <SideBar.Header value={activeListName} />

        {renderIf(
          currentNoteID >= 0,
          <Note.Header onDoubleClick={() => setCurrentNoteID(-1)}>
            <Note.Header.Title>
              <Editable
                as="h3"
                className="note-title"
                value={getCurrentNote()?.title || ''}
                placeholder="<empty name>"
                onChange={(e) => {
                  e.currentTarget.style.width = `${e.currentTarget.value.length}ch`;                  
                  updateCurrentNote((n) => ({ ...n, title: e.target.value }));
                }}
              />
            </Note.Header.Title>
            <Note.Header.Controls>
              <button
                className="button note-control"
                disabled={currentNoteID < 0}
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                delete
              </button>
            </Note.Header.Controls>
          </Note.Header>,
          <div className="note-placeholder">
            <div className="placeholder-message">Quicknotes</div>
          </div>
        )}

        <SideBar>
          <SearchBar>
            {renderIf(
              activeListName === 'notes',
              <input
                type="text"
                name="query"
                placeholder="Search..."
                id="search-query"
              />,
              <span id="search-placeholder">Click on tag to search...</span>
            )}
          </SearchBar>

          {renderIf(
            activeListName === 'notes',
            <SideBar.List className="note-list">
              {notes.map((note, index) => (
                <SideBar.List.Item
                  value={note.title || '<empty name>'}
                  key={`note-list-${index}`}
                  onClick={() => {
                    setCurrentNoteID(index);
                  }}
                  onAuxClick={(e) => {
                    if (e.button === 1) {
                      setCurrentNoteID(index);
                      setShowDeleteModal(true);
                    }
                  }}
                  className={cn({
                    active: index === currentNoteID,
                    placeholder: note.title === ''
                  })}
                />
              ))}
            </SideBar.List>,
            <SideBar.List className="tag-list">
              {tags.map((tag, index) => (
                <Tag
                  key={`tag-list-${index}`}
                  title={tag.title}
                  color={tag.color}
                />
              ))}
            </SideBar.List>
          )}

          <SideBar.Header
            value={activeListName === 'notes' ? 'tags' : 'notes'}
            className="alt"
            onClick={() => {
              setActiveList((state) => (state === 'notes' ? 'tags' : 'notes'));
            }}
          />
        </SideBar>

        {renderIf(
          currentNoteID >= 0,
          <Note key={currentNoteID}>
            <Note.Meta>
              <Note.Meta.Tags>
                {getCurrentNote()?.tags.map((tag, index) => (
                  <Editable
                    as="li"
                    key={`tag-editing-${index}`}
                    value={tag.title}
                    onChange={() => {}}
                    className="pill tag"
                    style={{ '--tag-color': tag.color } as React.CSSProperties}
                  />
                ))}

                {renderIf(
                  showNewTag,
                  <li>
                    <InlineForm
                      name="new-tag"
                      value="New tag"
                      onChange={() => {}}
                    />
                  </li>
                )}

                <li>
                  <Toggle
                    active={showNewTag}
                    onClick={() => setShowNewTag((state) => !state)}
                    label="+"
                    labelAlt="-"
                    className="button"
                  />
                </li>
              </Note.Meta.Tags>

              <Note.Meta.Dates
                createdAt={getCurrentNote()?.createdAt}
                modifiedAt={getCurrentNote()?.modifiedAt}
              />
            </Note.Meta>
            <Note.Content>
              <Note.Content.Markdown
                value={getCurrentNote()?.text ?? ''}
                onChange={(value, e, state) => {
                  console.log(state);
                  if (currentNoteID < 0) return;
                  updateCurrentNote((n) => ({
                    ...n,
                    text: value ?? '',
                    modifiedAt: new Date(),
                  }));
                }}
              />
            </Note.Content>
          </Note>
        )}
      </main>

      <Modal show={showDeleteModal}>
        <Modal.Header>
          <h3>Delete "{getCurrentNote()?.title || 'undefined'}"?</h3>
        </Modal.Header>
        <Modal.Body>
          <p>This action is irreversible!</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button red"
            onClick={() => {
              setCurrentNoteID(-1);
              deleteNote(currentNoteID);
              setShowDeleteModal(false);
            }}
          >
            Delete
          </button>
          <button
            className="button"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUserModal}>
        <Modal.Header>
          <h3>{fullname}</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex j-c-center">
            <button
              className="button"
              onClick={() => {
                signout();
              }}
            >
              Logout
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button"
            onClick={() => {
              setShowUserModal(false);
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
