import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

/**
 * CUSTOM HOOK: useFetch
 * 
 * Encapsulates ALL data-fetching logic so components stay clean.
 * Components just get: { data, loading, error, refetch }
 * 
 * Demonstrates:
 * - useEffect for side effects (fetching on mount or url change)
 * - useState for multiple state values (data, loading, error)
 * - useCallback to memoize the refetch function
 * - Cleanup with AbortController to prevent memory leaks
 * 
 * @param {string} url - API endpoint to fetch
 * @returns {{ data, loading, error, refetch }}
 */
export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (signal) => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(url, {
        // Pass signal so axios can cancel the request on cleanup
        signal,
      })
      setData(response.data)
    } catch (err) {
      // axios.isCancel: ignore errors caused by component unmounting
      if (!axios.isCancel(err)) {
        setError(err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    // AbortController lets us cancel in-flight requests when:
    // - the component unmounts
    // - the URL changes before the previous request finished
    const controller = new AbortController()

    fetchData(controller.signal)

    // Cleanup function: abort the request
    return () => controller.abort()
  }, [fetchData])

  // Expose a refetch function so components can trigger re-fetches manually
  const refetch = useCallback(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
  }, [fetchData])

  return { data, loading, error, refetch }
}
