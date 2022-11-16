import routes from "../../config/routes";
import { makeFailed, makeSuccessful } from "../../utils/Optional";
import { isNoteMetadata, isUserData, User, UserCreds } from "./types";


export async function register(user: User): Promise<number> {
  const res = await fetch(routes.register(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  return res.status;
}

export async function login(creds: UserCreds): Promise<number> {
  const res = await fetch(routes.login(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  })
  return res.status;
}

export const user = {
  fetch: async () => {
    const res = await fetch(routes.user())
    if (!res.ok) {
      const message = `HTTP request returned error code ${res.status}`
      return makeFailed(message)
    }
    const user = await res.json()
    if (isUserData(user)) {
      return makeSuccessful(user)
    }
    return makeFailed('bad data')
  },
  update: async (updates: Partial<User>) => {
    const res = await fetch(routes.user(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    return res.status
  }
}

export const note = {
  list: async () => {
    const res = await fetch(routes.notes())
    if (!res.ok) {
      const message = `HTTP request returned error code ${res.status}`
      return makeFailed(message)
    }
    const notes = await res.json()
    if (Array.isArray(notes) && notes.every(isNoteMetadata)) {
      return makeSuccessful(notes)
    }
    return makeFailed('bad format')
  }
}