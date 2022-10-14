import { useState } from 'react';
import Pill from './components/Pill';
import { cn, formatDate, generateColor } from './utils';
import Modal from './components/Modal';
import Editable from './components/Editable';
import './App.css';
import Toggle from './components/Toggle';
import InlineForm from './components/InlineForm';

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

const tags = {
  cool: NewTag('cool', generateColor()),
  awesome: NewTag('awesome', generateColor()),
};

const mockNotes: Note[] = [
  NewNote('school', 'hahaha i love school', [tags.cool, tags.awesome]),
  NewNote('foo', 'bar', [tags.cool, tags.awesome, tags.awesome, tags.awesome]),
  NewNote('something', 'something'),
];

export default function App() {
  const [userName, setUserName] = useState('Ivan');

  const [activeListName, setActiveList] = useState<ListNames>('notes');

  const [currentNoteID, setCurrentNoteID] = useState<number>(-1);

  const [notes, setNotes] = useState<Note[]>(mockNotes);

  const [showModal, setShowModal] = useState(false);

  const [showFontFamilies, setShowFontFamilies] = useState(false);

  const [titleEditing, setTitleEditing] = useState(false);

  const [tagsEditing, setTagsEditing] = useState(false);

  const [tagsAppending, setTagsAppending] = useState(false);

  const [fontFamily, setFontFamily] = useState('serif');

  const [searchTags, setSearchTags] = useState<Tag[]>();

  const getCurrentNote = () =>
    currentNoteID < 0 ? null : notes[currentNoteID];

  const updateCurrentNote = (trasnform: (prev: Note) => Note) => {
    setNotes((state) => {
      const prev = state.find((_, i) => i === currentNoteID);
      return prev
        ? state.map((n, i) => (i === currentNoteID ? trasnform(prev) : n))
        : state;
    });
  };

  const appendNotes = (note: Note) => {
    setNotes((state) => [...state, note]);
  };

  const prependNotes = (note: Note) => {
    setNotes((state) => [note, ...state]);
  };

  return (
    <div className="container">
      <div className="tool-bar">
        <button
          onClick={() => {
            prependNotes(NewNote('New note', '', [], new Date(), new Date()));
            setCurrentNoteID(0);
          }}
        >
          New
        </button>
        <div className="user-info">
          Hello, <span className="user-name">{userName}</span>
        </div>
      </div>
      <main>
        <div className="list-header-wrapper">
          <h3 className="list-header">{activeListName}</h3>
        </div>

        <div className="note-header">
          {/* <h3>{ getCurrentNote()?.title}</h3> */}
          <div className="note-title-wrapper">
            {getCurrentNote() && (
              <>
                <Toggle
                  active={titleEditing}
                  onClick={() => {
                    setTitleEditing((state) => !state);
                    document.getElementById('inline-form-note-title')?.focus();
                  }}
                  label="🖉"
                  labelAlt="✓"
                />
                <Editable
                  editable={titleEditing}
                  as="h3"
                  className="note-title"
                  name="note-title"
                  value={getCurrentNote()?.title || ''}
                  onChange={(e) => {
                    e.currentTarget.style.width = `${e.currentTarget.value.length}ch`;
                    updateCurrentNote((n) => ({ ...n, title: e.target.value }));
                  }}
                />
              </>
            )}
          </div>
          <div className="note-controls">
            <button className="note-control">edit</button>
            <button
              className="note-control danger"
              onClick={() => {
                setShowModal(true);
              }}
            >
              delete
            </button>
          </div>
        </div>

        <div className="list-container">
          <div id="search-bar">
            {(activeListName === 'notes' && (
              <input
                type="text"
                name="query"
                placeholder="Search..."
                id="search-query"
              />
            )) || (
              <span id="search-placeholder">Click on tag to search...</span>
            )}
          </div>
          <ul className="list">
            {(activeListName === 'notes'
              ? notes
              : notes
                  .map((note) => note.tags)
                  .flat()
                  .filter(
                    (tag, index, arr) =>
                      !arr.some((t, i) => tag.title === t.title && index > i)
                  )
            ).map((item, index) =>
              activeListName === 'notes' ? (
                <li
                  key={`note-${index}`}
                  onClick={() => {
                    setCurrentNoteID(index);
                  }}
                  className={cn('list-item', {
                    active: index === currentNoteID,
                  })}
                >
                  {item.title}
                </li>
              ) : (
                // FIXME:
                <Pill as="li" value={item.title} color={'pink'} />
              )
            )}
          </ul>
          <h3
            className="alt-list-header"
            onClick={() => {
              setActiveList((state) => (state === 'notes' ? 'tags' : 'notes'));
            }}
          >
            {activeListName === 'notes' ? 'tags' : 'notes'}
          </h3>
        </div>

        <div className="note">
          {showFontFamilies && (
            <div className="note-fonts">
              <button
                className={cn('note-font', { active: fontFamily === 'serif' })}
                onClick={() => {
                  setFontFamily('serif');
                }}
              >
                serif
              </button>
              <button
                className={cn('note-font', {
                  active: fontFamily === 'sans-serif',
                })}
                onClick={() => {
                  setFontFamily('sans-serif');
                }}
              >
                sans-serif
              </button>
              <button
                className={cn('note-font', {
                  active: fontFamily === 'monospace',
                })}
                onClick={() => {
                  setFontFamily('monospace');
                }}
              >
                monospace
              </button>
              <button
                className={cn('note-font', {
                  active: fontFamily === 'cursive',
                })}
                onClick={() => {
                  setFontFamily('cursive');
                }}
              >
                cursive
              </button>
            </div>
          )}
          <div className="note-meta">
            <ul className="note-tags">
              <li>
                {currentNoteID >= 0 && (
                  <Toggle
                    active={tagsEditing}
                    onClick={() => {
                      setTagsEditing((state) => !state);
                    }}
                    label="🖉"
                    labelAlt="✓"
                  />
                )}
              </li>
              {getCurrentNote()?.tags.map(({ title, color }, index) =>
                tagsEditing ? (
                  <InlineForm
                    name={`tag-${title}`}
                    value={title}
                    onChange={() => {}}
                    className="editing"
                    style={{
                      padding: '.15em 0',
                      borderRadius: '.5em',
                      border: '2px solid white',
                      // outline: '2px solid white',
                      backgroundColor: color,
                      fontStyle: 'italic',
                      color: 'white'
                    }}
                  />
                ) : (
                  <Pill
                    key={`tag-${index}`}
                    as="li"
                    value={title}
                    color={color}
                    className="tag"
                  />
                )
              )}

              {tagsEditing && (
                <li>
                  <Toggle
                    active={tagsAppending}
                    onClick={() => {
                      setTagsAppending((state) => !state);
                    }}
                    label="+"
                    labelAlt="-"
                  />
                </li>
              )}

              {tagsEditing && tagsAppending && (
                <li>
                  <InlineForm
                    name="new-tag"
                    value="New tag"
                    onChange={() => {}}
                  />
                </li>
              )}
            </ul>
            <div className="note-dates">
              <span
                className={cn('note-date', {
                  hidden: !getCurrentNote(),
                })}
              >
                created at {formatDate(getCurrentNote()?.createdAt)}
              </span>
              <span
                className={cn('note-date', {
                  hidden: !getCurrentNote(),
                })}
              >
                modified at {formatDate(getCurrentNote()?.modifiedAt)}
              </span>
            </div>
          </div>
          <div className="note-content-wrapper">
            <textarea
              name="text"
              id="note-content"
              spellCheck="false"
              value={getCurrentNote()?.text ?? ''}
              style={{ fontFamily }}
              readOnly={currentNoteID < 0}
              onChange={(e) => {
                if (currentNoteID < 0) return;
                updateCurrentNote((n) => ({ ...n, text: e.target.value }));
              }}
              onContextMenu={(e) => {
                if (currentNoteID < 0) return;
                e.preventDefault();
                setShowFontFamilies((state) => !state);
              }}
            />
          </div>
        </div>
      </main>

      <Modal show={showModal} setShow={setShowModal}></Modal>
    </div>
  );
}
