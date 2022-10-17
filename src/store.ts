// const storageKeys = ["username", "fullname", "session_id"] as const
const storageKeys = ["username", "fullname"] as const

type storageKey = typeof storageKeys[number]

const storage = {
  get(key: storageKey): string | null {
    return sessionStorage.getItem(key)
  },

  set(key: storageKey, value: string): void {
    return sessionStorage.setItem(key, value)
  },

  remove(key: storageKey): void {
    return sessionStorage.removeItem(key)
  }
}

export default storage