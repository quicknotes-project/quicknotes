import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isNote, isNoteMeta, Note, NoteMeta, NoteUpdate, Tag } from "./types";

async function getAllNotes(): Promise<Optional<NoteMeta[]>> {
  const res = await fetch(routes.notes(), {
    headers: {
      "ngrok-skip-browser-warning": "skip",
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not logged in");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  const notes = await res.json();

  if (!Array.isArray(notes) || !notes.every(isNoteMeta)) {
    console.log(notes);
    return makeFailed(`Server returned malformed data`);
  }

  return makeSuccessful(notes);
}

async function getNote(noteID: string): Promise<Optional<Note>> {
  const res = await fetch(routes.note(noteID), {
    headers: {
      "ngrok-skip-browser-warning": "skip",
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not authorized");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  const note = await res.json();

  if (!isNote(note)) {
    return makeFailed("Server returned malformed data");
  }

  return makeSuccessful(note);
}

async function updateNote(
  noteID: string,
  updates: NoteUpdate
): Promise<Optional<void>> {
  const res = await fetch(routes.note(noteID), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not authorized");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(undefined);
}

async function createNote(): Promise<Optional<Note>> {
  const res = await fetch(routes.note(), {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "skip",
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not logged in");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  const note = await res.json();

  if (!isNote(note)) {
    return makeFailed(`Server returned malformed data`);
  }

  return makeSuccessful(note);
}

async function deleteNote(noteID: string): Promise<Optional<void>> {
  const res = await fetch(routes.note(noteID), {
    method: "DELETE",
    headers: {
      "ngrok-skip-browser-warning": "skip",
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 400:
        return makeFailed("Bad request");
      case 401:
        return makeFailed("Not logged in");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

async function addTag(noteID: string, title: string): Promise<Optional<void>> {
  const res = await fetch(routes.notetag(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
    body: JSON.stringify({ noteID, title }),
  });

  if (!res.ok) {
    switch (res.status) {
      case 400:
        return makeFailed("Bad request");
      case 401:
        return makeFailed("Not logged in");
      case 403:
        return makeFailed("Invalid noteID supplied");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

async function editTag(
  noteID: string,
  tagID: string,
  title: string
): Promise<Optional<void>> {
  const res = await fetch(routes.notetag(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
    body: JSON.stringify({ noteID, tagID, title }),
  });

  if (!res.ok) {
    switch (res.status) {
      case 400:
        return makeFailed("Bad request");
      case 401:
        return makeFailed("Not logged in");
      case 403:
        return makeFailed("Invalid noteID or tagID supplied");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

async function deleteTag(
  noteID: string,
  tagID: string
): Promise<Optional<void>> {
  const res = await fetch(routes.notetag(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
    body: JSON.stringify({ noteID, tagID }),
  });

  if (!res.ok) {
    switch (res.status) {
      case 400:
        return makeFailed("Bad request");
      case 401:
        return makeFailed("Not logged in");
      case 403:
        return makeFailed("Invalid noteID or tagID supplied");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

export const note = {
  getAll: getAllNotes,
  get: getNote,
  update: updateNote,
  create: createNote,
  delete: deleteNote,
  addTag,
  editTag,
  deleteTag,
};
