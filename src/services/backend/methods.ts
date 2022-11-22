import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isNote, isNoteMetadata, isUserData, Note, NoteMetadata, NoteUpdate, User, UserCreds, UserData } from "./types";

export async function register(user: User): Promise<Optional<void>> {
  const res = await fetch(routes.register(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'skip',
    },
    body: JSON.stringify(user)
  })
  switch (res.status) {
    case 200:
      return makeSuccessful(undefined);
    case 409:
      return makeFailed('Username taken')
    default:
      return makeFailed(`Unknown error (status code ${res.status})`)
  }
}

export async function login(creds: UserCreds): Promise<Optional<void>> {
  const res = await fetch(routes.login(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'skip',
    },
    body: JSON.stringify(creds)
  })
  switch (res.status) {
    case 200:
      return makeSuccessful(undefined);
    case 401:
      return makeFailed('Invalid combination')
    default:
      return makeFailed(`Unknown error (status code ${res.status})`)
  }
}

export async function logout(): Promise<Optional<void>> {
  const res = await fetch(routes.logout(), { headers: { 'ngrok-skip-browser-warning': 'skip' } })
  switch (res.status) {
    case 200:
      return makeSuccessful(undefined);
    default:
      return makeFailed(`Unknown error (status code ${res.status})`)
  }
}

export const user: {
  fetch: () => Promise<Optional<UserData>>;
  update: (updates: Partial<User>) => Promise<Optional<void>>
} = {
  fetch: async () => {
    const res = await fetch(routes.user(), {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip',
      },
    })

    if (res.status === 401) {
      return makeFailed('Not authorized')
    }

    const user = await res.json()
    if (!isUserData(user)) {
      return makeFailed('Server returned malformed data')
    }

    return makeSuccessful(user)
  },

  update: async (updates: Partial<User>) => {
    const res = await fetch(routes.user(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip',
      },
      body: JSON.stringify(updates)
    })

    if (res.status !== 200) {
      return makeFailed(res.status.toString())
    }

    return makeSuccessful(undefined)
  }
}

export const note: {
  fetch: (noteID: string) => Promise<Optional<Note>>
  update: (noteID: string, updates: NoteUpdate) => Promise<Optional<void>>
  list: () => Promise<Optional<Array<NoteMetadata>>>
} = {
  fetch: async (noteID: string) => {
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
  },

  update: async (noteID: string, updates: Partial<Omit<Note, 'noteID'>>) => {
    const res = await fetch(routes.note(noteID), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip',
      },
      body: JSON.stringify(updates)
    })

    if (!res.ok) {
      switch (res.status) {
        case 401:
          return makeFailed('Not authorized')
        default:
          return makeFailed(`Unknown error (status code ${res.status})`)
      }
    }

    return makeSuccessful(undefined)
  },

  list: async () => {
    const res = await fetch(routes.notes(), {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip',
      },
    })

    if (!res.ok) {
      switch (res.status) {
        case 401:
          return makeFailed('Not logged in')
        default:
          return makeFailed(`Unknown error (status code ${res.status})`)
      }
    }

    const notes = await res.json()

    if (!Array.isArray(notes) || !notes.every(isNoteMetadata)) {
      console.log(notes)
      return makeFailed(`Server returned malformed data`)
    }

    return makeSuccessful(notes)
  }
}