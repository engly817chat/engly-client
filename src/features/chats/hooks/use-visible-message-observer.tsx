import { useEffect, useRef } from "react"

export const useVisibleMessages = (
  messageIds: string[],
  onVisible: (id: string) => void
) => {
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    }

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-message-id")
          if (id) onVisible(id)
        }
      })
    }, options)

    messageIds.forEach(id => {
      const el = document.querySelector(`[data-message-id="${id}"]`)
      if (el) observer.current?.observe(el)
    })

    return () => observer.current?.disconnect()
  }, [messageIds])
}
