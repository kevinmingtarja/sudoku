import { secondsToTime } from "@/lib/time"
import { HiMiniPause, HiPlay } from "react-icons/hi2"

const Timer = ({
  time,
  isPaused,
  handlePause,
  className,
}: {
  time: number
  isPaused: boolean
  handlePause: () => void
  className?: string
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="w-16 text-xl">{secondsToTime(time)}</div>
      {isPaused ? (
        <HiPlay className="cursor-pointer" size={19} onClick={handlePause} />
      ) : (
        <HiMiniPause
          className="cursor-pointer"
          size={19}
          onClick={handlePause}
        />
      )}
    </div>
  )
}

export default Timer
