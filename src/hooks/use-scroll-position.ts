"use client"

import { useState, useEffect } from "react"

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsAtTop(currentScrollY < 50) // Coi như "at top" nếu scroll < 50px
    }

    // Set initial position
    updateScrollPosition()

    window.addEventListener("scroll", updateScrollPosition)
    return () => window.removeEventListener("scroll", updateScrollPosition)
  }, [])

  return { scrollY, isAtTop }
}
