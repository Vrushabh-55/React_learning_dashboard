import { useState, useEffect } from 'react'

/**
 * CUSTOM HOOK: useDebounce
 * 
 * WHY: When a user types rapidly, we don't want to run expensive operations
 * (API calls, filtering big arrays) on every keystroke. Debouncing delays
 * the operation until the user pauses typing.
 * 
 * HOW:
 * 1. Keep a local 'debouncedValue' state
 * 2. On every 'value' change, set a setTimeout
 * 3. If value changes again before the delay expires, clear the old timer
 * 4. Only update debouncedValue after the user stops typing for 'delay' ms
 * 
 * @param {any} value  - The value to debounce (usually an input string)
 * @param {number} delay - Milliseconds to wait (default: 400ms)
 * @returns {any} debouncedValue - Only updates after the user stops typing
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Schedule update after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: if value changes before delay expires, cancel previous timer
    // This is the key to debouncing — we only keep the LAST scheduled update
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
