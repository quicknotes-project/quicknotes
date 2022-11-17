import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isNoteMetadata, isUserData, NoteMetadata, User, UserCreds, UserData } from "./types";

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
      return makeFailed('Not logged in')
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
  list: () => Promise<Optional<Array<NoteMetadata>>>
} = {
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
      return makeFailed('Server returned malformed data')
    }

    return makeSuccessful(notes)
  }
}