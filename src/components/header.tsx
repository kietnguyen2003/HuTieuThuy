"use client"

import { Button } from "@/components/ui/button"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import { cn } from "@/lib/utils"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const scrollDirection = useScrollDirection()
  const { isAtTop } = useScrollPosition()
  const pathname = usePathname()

  const getActivePage = () => {
    if (pathname === "/") return "Trang chủ"
    if (pathname === "/san-pham") return "Sản phẩm"
    if (pathname === "/lien-he") return "Liên hệ"
    return "Trang chủ"
  }

  const activePage = getActivePage()

  const navigationItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/san-pham" },
    { name: "Liên hệ", href: "/lien-he" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0",
        isAtTop ? "bg-transparent shadow-none" : "bg-white shadow-sm",
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo - clickable to go home */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              <img src="/icon.jpg" alt="Logo" className="rounded-full w-full h-full object-cover" />
            </span>
          </div>
          <span
            className={cn("font-bold text-xl transition-colors duration-300", isAtTop ? "text-white" : "text-emerald-600")}
          >
            Mẹ Sin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-2 py-2 font-open-sans transition-colors duration-300 ease-in-out group",
                activePage === item.name
                  ? isAtTop
                    ? "text-white font-semibold"
                    : "text-emerald-600 font-semibold"
                  : isAtTop
                    ? "text-white/90 hover:text-white"
                    : "text-gray-700 hover:text-emerald-600",
              )}
            >
              {item.name}
              {activePage === item.name && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              )}
              {activePage !== item.name && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 bg-emerald-600 rounded-full group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            className={cn(
              "hidden md:block font-open-sans transition-all duration-300",
              isAtTop ? "bg-white text-emerald-600 hover:bg-gray-100" : "bg-emerald-600 hover:bg-emerald-700 text-white",
            )}
          >
            Đặt hàng ngay
          </Button>
          <MobileNav activePage={activePage} isAtTop={isAtTop} />
        </div>
      </div>
    </header>
  )
}
