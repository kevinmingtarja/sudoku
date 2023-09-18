import { HiMiniPause, HiPlay } from "react-icons/hi2"

const Timer = ({
  time,
  isPaused,
  handlePause,
}: {
  time: number
  isPaused: boolean
  handlePause: () => void
}) => {
  const secondsToTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="flex items-center gap-1">
      {secondsToTime(time)}
      {isPaused ? (
        <HiPlay className="cursor-pointer" onClick={handlePause} />
      ) : (
        <HiMiniPause className="cursor-pointer" onClick={handlePause} />
      )}
    </div>
  )
}

export default Timer
