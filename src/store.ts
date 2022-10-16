const storageKeys = ["username", "fullname", "session_id"] as const

type storageKey = typeof storageKeys[number]

const storage = {
  get(key: storageKey): string | null {
    return sessionStorage.getItem(key)
  },

  set(key: storageKey, value: string): void {
    sessionStorage.setItem(key, value)
  },

  remove(key: storageKey): void {
    sessionStorage.removeItem(key)
  }
}

export default storage