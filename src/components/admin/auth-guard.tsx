"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const isLoggedIn = !!session

        setIsAuthenticated(isLoggedIn)

        // Update localStorage to match Supabase session
        if (isLoggedIn) {
          localStorage.setItem("adminLoggedIn", "true")
        } else {
          localStorage.removeItem("adminLoggedIn")
        }

        // Redirect logic
        if (!isLoggedIn && pathname !== "/admin/login") {
          router.push("/admin/login")
        } else if (isLoggedIn && pathname === "/admin/login") {
          router.push("/admin/dashboard")
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
        localStorage.removeItem("adminLoggedIn")
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isLoggedIn = !!session
      setIsAuthenticated(isLoggedIn)

      if (isLoggedIn) {
        localStorage.setItem("adminLoggedIn", "true")
      } else {
        localStorage.removeItem("adminLoggedIn")
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router, supabase])

  // Hiển thị loading khi đang kiểm tra xác thực
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-gray-600 font-merriweather">Đang kiểm tra đăng nhập...</span>
        </div>
      </div>
    )
  }

  // Nếu đang ở trang login hoặc đã xác thực, hiển thị nội dung
  if (pathname === "/admin/login" || isAuthenticated) {
    return <>{children}</>
  }

  // Mặc định không hiển thị gì khi đang chuyển hướng
  return null
}
