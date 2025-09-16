"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X } from "lucide-react"

export default function AddProductPage() {
  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Nếu đang ở phía server, không hiển thị gì
  if (!isClient) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Giả lập thêm sản phẩm
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Chuyển hướng về trang danh sách sản phẩm
    router.push("/admin/products")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-gray-800">Thêm sản phẩm mới</h1>
            <p className="text-gray-600 font-merriweather">Tạo sản phẩm mới cho Sầu Thành</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Thông tin sản phẩm */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200 mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-montserrat">Thông tin sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-open-sans">
                      Tên sản phẩm
                    </Label>
                    <Input id="name" placeholder="Nhập tên sản phẩm" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="font-open-sans">
                        Giá (VNĐ)
                      </Label>
                      <Input id="price" placeholder="Ví dụ: 35000" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="font-open-sans">
                        Danh mục
                      </Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bun">Bún tươi</SelectItem>
                          <SelectItem value="hu-tieu">Hủ tiếu</SelectItem>
                          <SelectItem value="banh-canh">Bánh canh</SelectItem>
                          <SelectItem value="pho">Phở</SelectItem>
                          <SelectItem value="banh-trang">Bánh tráng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-open-sans">
                      Mô tả sản phẩm
                    </Label>
                    <Textarea id="description" placeholder="Nhập mô tả chi tiết về sản phẩm" rows={5} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="font-open-sans">
                        Trạng thái
                      </Label>
                      <Select defaultValue="in-stock">
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-stock">Còn hàng</SelectItem>
                          <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku" className="font-open-sans">
                        Mã sản phẩm (SKU)
                      </Label>
                      <Input id="sku" placeholder="Ví dụ: ST-BUN-001" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-montserrat">Thông tin bổ sung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ingredients" className="font-open-sans">
                      Thành phần
                    </Label>
                    <Textarea id="ingredients" placeholder="Liệt kê các thành phần của sản phẩm" rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usage" className="font-open-sans">
                      Hướng dẫn sử dụng
                    </Label>
                    <Textarea id="usage" placeholder="Hướng dẫn cách sử dụng sản phẩm" rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage" className="font-open-sans">
                      Hướng dẫn bảo quản
                    </Label>
                    <Textarea id="storage" placeholder="Hướng dẫn cách bảo quản sản phẩm" rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hình ảnh và thao tác */}
            <div className="lg:col-span-1">
              <Card className="border-gray-200 mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-montserrat">Hình ảnh sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  {previewImage ? (
                    <div className="relative mb-4">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-64 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 w-8 h-8 p-0"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600 mb-1 font-open-sans">
                          Kéo thả hoặc nhấp để tải lên
                        </p>
                        <p className="text-xs text-gray-500 font-merriweather">PNG, JPG (tối đa 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-4 font-open-sans bg-transparent"
                      onClick={() => document.getElementById("fileInput")?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn hình ảnh
                    </Button>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-montserrat">Thao tác</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 font-open-sans"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-open-sans bg-transparent"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
