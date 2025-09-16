"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, FileText, Users, Settings, LogOut, Menu, X } from "lucide-react"

export function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("adminLoggedIn")
      router.push("/admin/login")
    } catch (error) {
      console.error('Error signing out:', error)
      // Still redirect to login even if signout fails
      localStorage.removeItem("adminLoggedIn")
      router.push("/admin/login")
    }
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Sản phẩm", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
    { name: "Đơn hàng", href: "/admin/orders", icon: <FileText className="w-5 h-5" /> },
    { name: "Khách hàng", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">ST</span>
              </div>
              <span className="font-bold text-lg text-green-600 font-montserrat">Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-green-600 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {item.icon}
                <span className="font-open-sans">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-green-600 hover:bg-green-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-open-sans">Đăng xuất</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-open-sans">{item.name}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center justify-start space-x-2 px-3 py-2 w-full text-left text-gray-700 hover:text-green-600 hover:bg-green-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-open-sans">Đăng xuất</span>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
