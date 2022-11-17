import React, { useState, useEffect } from 'react';
import { NewNote } from './services/backend';
import * as api from './services/backend';
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
import { cn, renderIf } from './utils';
import { handleOption } from './utils/Optional';
import './styles/App.css';

const listNames = ['notes', 'tags'] as const;
type ListNames = typeof listNames[number];

export default function App() {
  const { signout, fullname } = useAuth();

  const [currentNoteID, setCurrentNoteID] = useState<number>(-1);
  const [activeListName, setActiveList] = useState<ListNames>('notes');

  const [notes, setNotes] = useState<api.NoteMetadata[]>([]);

  const [showSideBar, setShowSideBar] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const [showNewTag, setShowNewTag] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // const [searchTags, setSearchTags] = useState<Tag[]>();

  const tags = notes.map((note) => note.tags).flat();

  const getCurrentNote = () =>
    currentNoteID < 0 ? null : notes[currentNoteID];

  const updateCurrentNote = (
    transform: (prev: api.NoteMetadata) => api.NoteMetadata
  ) => {
    setNotes((state) => {
      const prev = state.find((_, i) => i === currentNoteID);
      return prev
        ? state.map((n, i) => (i === currentNoteID ? transform(prev) : n))
        : state;
    });
  };

  const prependNotes = (note: api.NoteMetadata) => {
    setNotes((state) => [note, ...state]);
  };

  const deleteNote = (index: number) => {
    setNotes((state) => state.filter((_, i) => i !== index));
  };

  const fetchData = async () => {
    const notesOption = await api.note.list();

    if (!notesOption.success) return;

    handleOption(setNotes, () => {})(notesOption);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 400);
    window.addEventListener('resize', checkMobile);
    checkMobile();

    fetchData();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="container">
      <ToolBar>
        <ToolBar.Controls>
          <button
            className="button"
            onClick={() => {
              setShowSideBar((state) => !state);
            }}
          >
            ≡
          </button>
          <button
            className="button"
            onClick={() => {
              // prependNotes(NewNote('New note', '', [], new Date(), new Date()));
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
        {/* {renderIf(
          showSideBar, */}
        <SideBar className={{ 'slide-right': !showSideBar }}>
          <SideBar.Header value={activeListName} />

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
                    if (isMobile) {
                      setShowSideBar(false);
                    }
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
                    placeholder: note.title === '',
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
        {/* )} */}

        {renderIf(
          currentNoteID >= 0,
          <Note key={currentNoteID}>
            <Note.Header onDoubleClick={() => setCurrentNoteID(-1)}>
              <Note.Header.Title>
                <Editable
                  as="h3"
                  className="note-title"
                  value={getCurrentNote()?.title || ''}
                  placeholder="<empty name>"
                  onChange={(e) => {
                    e.currentTarget.style.width = `${e.currentTarget.value.length}ch`;
                    updateCurrentNote((n) => ({
                      ...n,
                      title: e.target.value,
                    }));
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
            </Note.Header>

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
                value={''}
                // value={getCurrentNote()?.content ?? ''}
                onChange={(value, e, state) => {
                  if (currentNoteID < 0) return;
                  updateCurrentNote((n) => ({
                    ...n,
                    text: value ?? '',
                    modifiedAt: new Date(),
                  }));
                }}
              />
            </Note.Content>
          </Note>,

          <div className="note-placeholder">
            <div className="placeholder-message">Quicknotes</div>
          </div>
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
