import { useState, useEffect, Dispatch, SetStateAction } from "react"

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
