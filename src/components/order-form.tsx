"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductWithImage } from "@/lib/getProducts"
import { ShoppingCart, Package, MapPin, Phone, CheckCircle, X } from "lucide-react"

interface OrderFormProps {
  products: ProductWithImage[]
}

export function OrderForm({ products }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    productId: "",
    quantity: "",
    notes: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const selectedProduct = products.find(p => p.id === formData.productId)

      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address,
        productId: formData.productId,
        productName: selectedProduct?.name || "",
        quantity: formData.quantity,
        notes: formData.notes || null
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      const result = await response.json()
      console.log("Order submitted successfully:", result)

      setOrderNumber(result.order?.order_number || "")
      setSubmitStatus("success")
      setShowSuccessModal(true)

      // Reset form after a delay to let user see the success message
      setTimeout(() => {
        setFormData({
          customerName: "",
          phone: "",
          email: "",
          address: "",
          productId: "",
          quantity: "",
          notes: ""
        })
      }, 3000)
    } catch (error) {
      console.error("Error submitting order:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProduct = products.find(p => p.id === formData.productId)

  // Auto-close success modal after 10 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false)
        setSubmitStatus("idle")
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  return (
    <Card className="shadow-xl border border-emerald-100">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
        <CardTitle className="flex items-center gap-3 text-emerald-700">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          Đặt hàng trực tiếp
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {submitStatus === "success" && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Đặt hàng thành công!</h3>
                <div className="space-y-2 text-green-700">
                  <p className="text-sm">
                    <strong>Cảm ơn bạn đã đặt hàng!</strong> Đơn hàng của bạn đã được gửi đến hệ thống.
                  </p>
                  <p className="text-sm">
                    📞 Chúng tôi sẽ liên hệ với bạn trong <strong>15-30 phút</strong> để xác nhận đơn hàng.
                  </p>
                  <p className="text-sm">
                    🚚 Thời gian giao hàng dự kiến: <strong>30-60 phút</strong> tùy theo khu vực.
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-green-600">
                      <strong>Hotline hỗ trợ:</strong> <span className="font-mono">0911 288 338</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">❌ Có lỗi xảy ra!</p>
            <p className="text-sm">Vui lòng thử lại hoặc gọi hotline: 0911 288 338</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Thông tin khách hàng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
                  Họ và tên *
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Số điện thoại *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0911 288 338"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@example.com (không bắt buộc)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Địa chỉ giao hàng *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Nhập địa chỉ giao hàng chi tiết"
                className="mt-1"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Thông tin sản phẩm
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                  Chọn sản phẩm *
                </Label>
                <Select value={formData.productId} onValueChange={(value) => handleInputChange("productId", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Số lượng *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="Nhập số lượng"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-emerald-800">{selectedProduct.name}</h4>
                    <p className="text-sm text-emerald-600">
                      {selectedProduct.short_description || selectedProduct.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Ghi chú thêm
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Có gì cần lưu ý đặc biệt không?"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                GỬI ĐƠN HÀNG
              </div>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>Hoặc gọi trực tiếp: <span className="font-semibold text-emerald-600">0911 288 338</span></p>
          </div>
        </form>
      </CardContent>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-700">Đặt hàng thành công!</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-center">
            {/* Celebration Animation */}
            <div className="relative py-8">
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full animate-ping opacity-20"></div>
              </div>
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded animate-pulse"></div>
                <div className="absolute top-6 right-6 w-1 h-1 bg-red-400 rounded animate-bounce"></div>
                <div className="absolute top-12 left-8 w-1 h-1 bg-blue-400 rounded animate-ping"></div>
                <div className="absolute top-4 right-12 w-2 h-2 bg-green-400 rounded animate-pulse"></div>
                <div className="absolute top-10 left-12 w-1 h-1 bg-purple-400 rounded animate-bounce"></div>
                <div className="absolute top-8 right-4 w-1 h-1 bg-pink-400 rounded animate-ping"></div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 mb-1">Mã đơn hàng của bạn:</p>
                <p className="text-lg font-bold text-green-800 font-mono">{orderNumber}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Cảm ơn bạn đã đặt hàng!</strong>
                </p>
                <p>
                  📞 Chúng tôi sẽ liên hệ với bạn trong <strong className="text-emerald-600">15-30 phút</strong> để xác nhận đơn hàng.
                </p>
                <p>
                  🚚 Thời gian giao hàng dự kiến: <strong className="text-emerald-600">30-60 phút</strong>
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700">
                  <strong>Hotline hỗ trợ:</strong>
                </p>
                <p className="text-lg font-bold text-emerald-800 font-mono">0911 288 338</p>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}