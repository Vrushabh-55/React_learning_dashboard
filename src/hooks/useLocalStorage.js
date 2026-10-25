import { useState, useEffect } from 'react'

/**
 * CUSTOM HOOK: useLocalStorage
 * 
 * Works exactly like useState, but persists to localStorage.
 * Great for saving todos, form drafts, preferences, etc.
 * 
 * @param {string} key     - localStorage key
 * @param {any} initialValue - default value if nothing stored yet
 */
export default function useLocalStorage(key, initialValue) {
  // Initialize state from localStorage (or fall back to initialValue)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      // Parse stored JSON, or use initialValue if nothing stored
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error)
      return initialValue
    }
  })

  // Sync to localStorage every time storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}"`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
