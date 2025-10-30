import { useState, useEffect, useRef, useMemo } from "react"

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstRender = useRef(true)

  // Memoize the delay to prevent unnecessary effect re-runs
  const memoizedDelay = useMemo(() => delay, [delay])

  useEffect(() => {
    // Skip debouncing on first render to avoid unnecessary delay
    if (isFirstRender.current) {
      isFirstRender.current = false
      setDebouncedValue(value)
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Skip timeout creation if delay is 0 for instant updates
    if (memoizedDelay === 0) {
      setDebouncedValue(value)
      return
    }

    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
      timeoutRef.current = null
    }, memoizedDelay)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [value, memoizedDelay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedValue
}
