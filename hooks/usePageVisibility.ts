import { useEffect, useState } from "react"

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  const onVisibilityChange = () => setIsVisible(!document.hidden)

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange, false)

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  })

  return isVisible
}
