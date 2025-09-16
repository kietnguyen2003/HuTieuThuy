"use client"

import { useState, useEffect } from "react"

export function useActivePage() {
  const [activePage, setActivePage] = useState("Trang chủ")

  useEffect(() => {
    // In a real app, this would be based on the current route
    // For demo purposes, we'll simulate page detection
    const path = window.location.pathname

    if (path === "/" || path === "/home") {
      setActivePage("Trang chủ")
    } else if (path.includes("/products") || path.includes("/san-pham")) {
      setActivePage("Sản phẩm")
    } else if (path.includes("/contact") || path.includes("/lien-he")) {
      setActivePage("Liên hệ")
    }
  }, [])

  return { activePage, setActivePage }
}
