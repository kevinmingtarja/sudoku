import { useState, useEffect, Dispatch, SetStateAction } from "react"

/**
 * Returns a time (in seconds) that starts at 0,
 * increments every second, unless isPaused is true.
 * The time can be reset by calling reset().
 */
const useTimer = (): {
  time: number
  setTime: Dispatch<SetStateAction<number>>
  isPaused: boolean
  setIsPaused: Dispatch<SetStateAction<boolean>>
  reset: () => void
} => {
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const reset = () => {
    setTime(0)
  }

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setTime(time + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [time, isPaused])

  return { time, setTime, isPaused, setIsPaused, reset }
}

export default useTimer
