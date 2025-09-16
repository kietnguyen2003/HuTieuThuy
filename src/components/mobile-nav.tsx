"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileNavProps {
  activePage: string
  isAtTop: boolean
}

export function MobileNav({ activePage, isAtTop }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/san-pham" },
    { name: "Liên hệ", href: "/lien-he" },
  ]

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 transition-colors duration-300",
          isAtTop ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100",
        )}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-open-sans transition-colors duration-200",
                    activePage === item.name
                      ? "text-emerald-600 font-semibold border-l-4 border-emerald-600"
                      : "text-gray-700 hover:text-emerald-600",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-open-sans">Đặt hàng ngay</Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
