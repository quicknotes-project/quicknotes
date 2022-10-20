import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import TagEl from './components/Tag';
import Modal from './components/Modal';
import NoteEl from './components/Note';
import Toggle from './components/Toggle';
import Editable from './components/Editable';
import ToolBar from './components/ToolBar';
import SideBar from './components/SideBar';
import SearchBar from './components/SearchBar';
import InlineForm from './components/InlineForm';
// import ButtonSelect from './components/ButtonSelect';
import { cn, generateRandomColor, renderIf, safeJSONParse } from './utils';
import { handleOption } from './Optional';
import './App.css';

// const fontFamilies = ['serif', 'sans-serif', 'monospace', 'cursive'] as const;

const listNames = ['notes', 'tags'] as const;

type ListNames = typeof listNames[number];

interface Tag {
  title: string;
  color: string;
}

function NewTag(title: string, color: string): Tag {
  return { title, color };
}

interface Note {
  title: string;
  text: string;
  tags: Tag[];
  createdAt: Date;
  modifiedAt: Date;
}

function isNote(value: any): value is Note {
  return (
    'title' in value &&
    'text' in value &&
    'tags' in value &&
    'createdAt' in value &&
    'modifiedAt' in value
  );
}

function isNoteArray(value: any): value is Note[] {
  return Array.isArray(value) && value.every(isNote);
}

function NewNote(
  title: string,
  text: string,
  tags?: Tag[],
  createdAt?: Date,
  modifiedAt?: Date
): Note {
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

const mockNotes: Note[] = [
  NewNote(
    'school',
    'hahaha i love school '.repeat(48),
    [mockTags.cool, mockTags.awesome],
    new Date(Date.parse('2022-10-01')),
    new Date(Date.parse('2022-10-01'))
  ),
  NewNote(
    'foo',
    'bar',
    [mockTags.cool, mockTags.awesome, mockTags.awesome, mockTags.awesome],
    new Date(Date.parse('2022-09-30')),
    new Date(Date.parse('2022-09-30'))
  ),
  NewNote('something', 'something', [mockTags.nice, mockTags.wow]),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
];

export default function App() {
  const { signout, fullname } = useAuth();

  const [currentNoteID, setCurrentNoteID] = useState<number>(-1);
  const [activeListName, setActiveList] = useState<ListNames>('notes');

  const [notes, setNotes] = useState<Note[]>(mockNotes);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const [titleEditing, setTitleEditing] = useState(false);
  const [tagsEditing, setTagsEditing] = useState(false);
  const [tagsAppending, setTagsAppending] = useState(false);

  // const [showFontFamilies, setShowFontFamilies] = useState(false);
  // const [fontFamily, setFontFamily] = useState('serif');

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

  const updateCurrentNote = (transform: (prev: Note) => Note) => {
    setNotes((state) => {
      const prev = state.find((_, i) => i === currentNoteID);
      return prev
        ? state.map((n, i) => (i === currentNoteID ? transform(prev) : n))
        : state;
    });
  };

  const prependNotes = (note: Note) => {
    setNotes((state) => [note, ...state]);
  };

  const deleteNote = (index: number) => {
    setNotes((state) => state.filter((_, i) => i !== index));
  };

  const fetchData = async () => {
    const res = await fetch('/notes');

    if (res.status !== 200) return;

    const raw = await res.json();
    const notesOption = safeJSONParse(isNoteArray)(raw);

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
              prependNotes(NewNote('New note', '', [], new Date(), new Date()));
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
          <NoteEl.Header onDoubleClick={() => setCurrentNoteID(-1)}>
            <NoteEl.Header.Title>
              <Editable
                as="h3"
                className="note-title"
                name="note-title"
                value={getCurrentNote()?.title || ''}
                onChange={(e) => {
                  e.currentTarget.style.width = `${e.currentTarget.value.length}ch`;
                  updateCurrentNote((n) => ({ ...n, title: e.target.value }));
                }}
              />
            </NoteEl.Header.Title>
            <NoteEl.Header.Controls>
              <button
                className="button note-control"
                disabled={currentNoteID < 0}
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                delete
              </button>
            </NoteEl.Header.Controls>
          </NoteEl.Header>,
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
                  value={note.title}
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
                  })}
                />
              ))}
            </SideBar.List>,
            <SideBar.List className="tag-list">
              {tags.map((tag, index) => (
                <TagEl
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
          <NoteEl key={currentNoteID}>
            {/* {renderIf(
              showFontFamilies,
              <ButtonSelect
                value={fontFamily}
                onClick={(option) => setFontFamily(option)}
                options={fontFamilies}
                className="note-fonts"
              />
            )} */}
            <NoteEl.Meta>
              <NoteEl.Meta.Tags>
                {/* <li>
                  <Toggle
                    className="button"
                    active={tagsEditing}
                    onClick={() => {
                      setTagsEditing((state) => !state);
                    }}
                    label="🖉"
                    labelAlt="✓"
                  />
                </li> */}

                {getCurrentNote()?.tags.map(
                  (tag, index) => (
                    // tagsEditing ? (
                    <Editable
                      key={`tag-editing-${index}`}
                      name={`tag-${tag.title}`}
                      value={tag.title}
                      onChange={() => {}}
                      className="pill tag"
                      style={{ '--tag-color': tag.color } as React.CSSProperties}
                    />
                  )
                  // ) : (
                  //   <TagEl
                  //     key={`tag-${index}`}
                  //     title={tag.title}
                  //     color={tag.color}
                  //   />
                  // )
                )}

                <li>
                  <Toggle
                    active={tagsAppending}
                    onClick={() => {
                      setTagsAppending((state) => !state);
                    }}
                    label="+"
                    labelAlt="-"
                    className="button"
                  />
                </li>

                {renderIf(
                  tagsEditing && tagsAppending,
                  <li>
                    <InlineForm
                      name="new-tag"
                      value="New tag"
                      onChange={() => {}}
                    />
                  </li>
                )}
              </NoteEl.Meta.Tags>

              <NoteEl.Meta.Dates
                createdAt={getCurrentNote()?.createdAt}
                modifiedAt={getCurrentNote()?.modifiedAt}
              />
            </NoteEl.Meta>
            <NoteEl.Content>
              {/* <NoteEl.Content.Text
                name="text"
                id="note-content"
                value={getCurrentNote()?.text ?? ''}
                onChange={(e) => {
                  if (currentNoteID < 0) return;
                  updateCurrentNote((n) => ({
                    ...n,
                    text: e.target.value,
                    modifiedAt: new Date(),
                  }));
                }}
                style={{ fontFamily }}
                onContextMenu={(e) => {
                  if (currentNoteID < 0) return;
                  e.preventDefault();
                  setShowFontFamilies((state) => !state);
                }}
              /> */}
              <NoteEl.Content.Markdown
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
                // onContextMenu={(e) => {
                //   if (currentNoteID < 0) return;
                //   e.preventDefault();
                //   setShowFontFamilies((state) => !state);
                // }}
              />
            </NoteEl.Content>
          </NoteEl>
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
            onClick={() => {
              setCurrentNoteID(-1);
              deleteNote(currentNoteID);
              setShowDeleteModal(false);
            }}
            className="red"
          >
            Delete
          </button>
          <button
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
