"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Loader2 } from "lucide-react"
import { fetchAdminProducts, deleteProduct, updateProductStatus, type AdminProductWithImage } from "@/lib/admin/adminData"
import { useToast } from "@/hooks/use-toast"

export default function AdminProductsPage() {
  const [isClient, setIsClient] = useState(false)
  const [products, setProducts] = useState<AdminProductWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<AdminProductWithImage[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
    loadProducts()
  }, [])

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const fetchedProducts = await fetchAdminProducts()
      setProducts(fetchedProducts)
      setFilteredProducts(fetchedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return

    try {
      await deleteProduct(productId)
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa"
      })
      loadProducts() // Reload the products list
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive"
      })
    }
  }

  const formatPrice = (price: number, salePrice?: number | null) => {
    if (salePrice && salePrice < price) {
      return (
        <div className="flex flex-col">
          <span className="text-green-600 font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salePrice)}
          </span>
          <span className="text-gray-400 line-through text-sm">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </span>
        </div>
      )
    }
    return (
      <span className="text-gray-900 font-bold">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
      </span>
    )
  }

  const getStatusDisplay = (status: string) => {
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

  // Nếu đang ở phía server, không hiển thị gì
  if (!isClient) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-gray-800">Quản lý sản phẩm</h1>
            <p className="text-gray-600 font-merriweather">Quản lý tất cả sản phẩm của Sầu Thành</p>
          </div>

          <Button
            className="bg-green-600 hover:bg-green-700 font-open-sans flex items-center gap-2"
            onClick={() => router.push("/admin/products/add")}
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </Button>
        </div>

        <Card className="border-gray-200 mb-8">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-lg font-montserrat">Danh sách sản phẩm</CardTitle>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-10 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Lọc
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600 font-merriweather">Đang tải dữ liệu...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-merriweather">Không có sản phẩm nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">Sản phẩm</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">Danh mục</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">Giá</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">Kho</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">
                        Trạng thái
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 font-open-sans">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const statusDisplay = getStatusDisplay(product.status);
                      return (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-merriweather text-sm text-gray-600">{product.sku}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 rounded-md object-cover mr-3 border border-gray-200"
                              />
                              <div>
                                <span className="font-merriweather font-medium text-gray-900 block">{product.name}</span>
                                <span className="text-xs text-gray-500">{product.totalImages} hình ảnh</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-merriweather">{product.category}</td>
                          <td className="py-3 px-4">{formatPrice(product.price, product.sale_price)}</td>
                          <td className="py-3 px-4 font-merriweather">
                            <span className={`text-sm ${
                              product.stock_quantity > 10 ? 'text-green-600' :
                              product.stock_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full font-open-sans ${statusDisplay.class}`}
                            >
                              {statusDisplay.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500 font-merriweather">
                  Hiển thị {filteredProducts.length} của {products.length} sản phẩm
                  {searchTerm && ` (tìm kiếm: "${searchTerm}")`}
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
