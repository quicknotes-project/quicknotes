import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isUserData, User, UserCreds, UserData } from "./types";

async function registerUser(user: User): Promise<Optional<void>> {
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

async function loginUser(creds: UserCreds): Promise<Optional<void>> {
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

async function logoutUser(): Promise<Optional<void>> {
  const res = await fetch(routes.logout(), { headers: { 'ngrok-skip-browser-warning': 'skip' } })
  switch (res.status) {
    case 200:
      return makeSuccessful(undefined);
    default:
      return makeFailed(`Unknown error (status code ${res.status})`)
  }
}

async function fetchUser(): Promise<Optional<UserData>> {
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
}

async function updateUser(updates: Partial<User>): Promise<Optional<void>> {
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

export const user = {
  register: registerUser,
  login: loginUser,
  logout: logoutUser,
  fetch: fetchUser,
  update: updateUser
}