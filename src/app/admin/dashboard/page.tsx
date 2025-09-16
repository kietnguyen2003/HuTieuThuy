"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, Loader2, Image } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { getAdminStats, fetchAdminProducts } from "@/lib/admin/adminData"

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    totalImages: 0
  })
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    setIsClient(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, productsData] = await Promise.all([
        getAdminStats(),
        fetchAdminProducts()
      ])

      setStats(statsData)
      setRecentProducts(productsData.slice(0, 5)) // Get latest 5 products
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active':
        return { text: 'Còn hàng', class: 'bg-green-100 text-green-800' }
      case 'out_of_stock':
        return { text: 'Hết hàng', class: 'bg-red-100 text-red-800' }
      case 'inactive':
        return { text: 'Tạm ngừng', class: 'bg-gray-100 text-gray-800' }
      default:
        return { text: 'Không xác định', class: 'bg-gray-100 text-gray-800' }
    }
  }

  const formatPrice = (price, salePrice = null) => {
    if (salePrice && salePrice < price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salePrice)
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  // Nếu đang ở phía server, không hiển thị gì
  if (!isClient) return null

  const statsCards = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts.toString(),
      icon: <Package className="w-8 h-8 text-emerald-600" />,
      change: `${stats.activeProducts} đang hoạt động`,
      trend: "up",
    },
    {
      title: "Sản phẩm hoạt động",
      value: stats.activeProducts.toString(),
      icon: <ShoppingCart className="w-8 h-8 text-green-600" />,
      change: `${stats.outOfStockProducts} hết hàng`,
      trend: stats.outOfStockProducts === 0 ? "up" : "down",
    },
    {
      title: "Hình ảnh",
      value: stats.totalImages.toString(),
      icon: <Image className="w-8 h-8 text-purple-600" />,
      change: "Tổng hình ảnh",
      trend: "up",
    },
    {
      title: "Tỷ lệ có sẵn",
      value: stats.totalProducts > 0 ? `${Math.round((stats.activeProducts / stats.totalProducts) * 100)}%` : "0%",
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      change: "Sản phẩm có sẵn",
      trend: "up",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-montserrat text-gray-800">Dashboard</h1>
          <p className="text-gray-600 font-merriweather">Xin chào Admin, chào mừng trở lại!</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600 font-merriweather">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="border-gray-200 hover:border-emerald-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 font-open-sans">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1 font-montserrat">{stat.value}</h3>
                      <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-green-600" : "text-yellow-600"}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Products */}
        <Card className="mb-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-montserrat">Sản phẩm gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600 font-merriweather">Đang tải...</span>
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 font-merriweather">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">
                        Sản phẩm
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">Danh mục</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">Giá</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => {
                      const statusDisplay = getStatusDisplay(product.status);
                      return (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-merriweather text-sm text-gray-600">{product.sku}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200"
                              />
                              <span className="font-merriweather">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-merriweather">{product.category}</td>
                          <td className="py-3 px-4 font-merriweather font-bold text-gray-900">
                            {formatPrice(product.price, product.sale_price)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full font-open-sans ${statusDisplay.class}`}
                            >
                              {statusDisplay.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
