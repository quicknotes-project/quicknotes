import { Dispatch, SetStateAction, useState } from "react"

export function useStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (err) {
      console.error(err)
      sessionStorage.removeItem(key)
      return initialValue;
    }
  })

  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      const updated = value instanceof Function ? value(storedValue) : value
      setStoredValue(updated)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(updated))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return [storedValue, setValue]
}
