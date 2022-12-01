import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { EmptyNote, isEmptyNote, isNote, isNoteMetadata, Note, NoteMetadata, NoteUpdate } from "./types";

async function fetchNote(noteID: string): Promise<Optional<Note>> {
  const res = await fetch(routes.note(noteID), {
    headers: {
      'ngrok-skip-browser-warning': 'skip',
    }
  })

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed('Not authorized')
      default:
        return makeFailed(`Unknown error (status code ${res.status})`)
    }
  }

  const note = await res.json()

  if (!isNote(note)) {
    return makeFailed('Server returned malformed data')
  }

  return makeSuccessful(note)
}

async function updateNote(noteID: string, updates: NoteUpdate): Promise<Optional<void>> {
  const res = await fetch(routes.note(noteID), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'skip',
    },
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed('Not authorized');
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(undefined);
}

async function listNotes(): Promise<Optional<NoteMetadata[]>> {
  const res = await fetch(routes.notes(), {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'skip',
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed('Not logged in');
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  const notes = await res.json();

  if (!Array.isArray(notes) || !notes.every(isNoteMetadata)) {
    console.log(notes);
    return makeFailed(`Server returned malformed data`);
  }

  return makeSuccessful(notes);
}

async function createNote(): Promise<Optional<Note>> {
  const res = await fetch(routes.note(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'skip',
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed('Not logged in');
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  const note = await res.json()

  if (!isEmptyNote(note)) {
    return makeFailed(`Server returned malformed data`);
  }

  return makeSuccessful({ ...note, tags: [], content: '' })
}

export const note = {
  fetch: fetchNote,
  update: updateNote,
  list: listNotes,
  create: createNote
}