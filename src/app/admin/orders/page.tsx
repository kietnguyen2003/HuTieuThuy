"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck
} from "lucide-react"

interface OrderItem {
  product_name: string
  quantity: number
  product_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string
  shipping_address: string
  total_amount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_method: string
  payment_status: string
  notes?: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-purple-100 text-purple-800"
    case "shipped":
      return "bg-orange-100 text-orange-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />
    case "confirmed":
      return <CheckCircle className="w-4 h-4" />
    case "processing":
      return <Package className="w-4 h-4" />
    case "shipped":
      return <Truck className="w-4 h-4" />
    case "delivered":
      return <CheckCircle className="w-4 h-4" />
    case "cancelled":
      return <XCircle className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận"
    case "confirmed":
      return "Đã xác nhận"
    case "processing":
      return "Đang xử lý"
    case "shipped":
      return "Đã giao"
    case "delivered":
      return "Hoàn thành"
    case "cancelled":
      return "Đã hủy"
    default:
      return "Không xác định"
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/orders?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const { orders } = await response.json()
      setOrders(orders)
      setFilteredOrders(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      // Refresh orders after status update
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status).length
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải đơn hàng...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng của khách hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                  <p className="text-2xl font-bold text-gray-900">{getOrdersByStatus('pending')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                  <p className="text-2xl font-bold text-gray-900">{getOrdersByStatus('confirmed')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã giao</p>
                  <p className="text-2xl font-bold text-gray-900">{getOrdersByStatus('shipped')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">{getOrdersByStatus('delivered')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, số điện thoại, mã đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipped">Đã giao</SelectItem>
                    <SelectItem value="delivered">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{order.order_number}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            <p>{order.customer_phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4" />
                          <div>
                            {order.order_items && order.order_items.length > 0 ? (
                              <>
                                <p className="font-medium text-gray-900">{order.order_items[0].product_name}</p>
                                <p>Số lượng: {order.order_items[0].quantity}</p>
                                {order.order_items.length > 1 && (
                                  <p className="text-xs text-gray-500">+{order.order_items.length - 1} sản phẩm khác</p>
                                )}
                              </>
                            ) : (
                              <p className="font-medium text-gray-900">Không có sản phẩm</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-gray-900">Đặt hàng</p>
                            <p>{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </div>

                      {order.customer_email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <Mail className="w-4 h-4" />
                          <p>{order.customer_email}</p>
                        </div>
                      )}

                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <p>{order.shipping_address}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <span className="font-medium">Tổng tiền:</span>
                        <span className="font-bold text-emerald-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(order.total_amount)}
                        </span>
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm"><strong>Ghi chú:</strong> {order.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 lg:w-48">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xác nhận</SelectItem>
                          <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                          <SelectItem value="processing">Đang xử lý</SelectItem>
                          <SelectItem value="shipped">Đã giao</SelectItem>
                          <SelectItem value="delivered">Hoàn thành</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có đơn hàng</h3>
                  <p className="text-gray-600">Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}