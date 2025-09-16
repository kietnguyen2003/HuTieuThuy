"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Eye, Trash2, Edit, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { uploadProductImage, deleteProductImage, updateImageInfo } from "@/lib/admin/adminData"
import type { AdminProductWithImage } from "@/lib/admin/adminData"

interface ProductFormData {
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  sale_price: number | null
  sku: string
  stock_quantity: number
  status: 'active' | 'inactive' | 'out_of_stock'
  featured: boolean
  ingredients: string
  usage_instructions: string[]
  storage_instructions: string[]
  meta_title: string
  meta_description: string
  color: string
}

interface ProductImage {
  id: string
  image_url: string
  alt_text: string
  is_primary: boolean
  type: string
  sort_order: number
  publicUrl: string
}

export default function EditProductPage() {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<ProductFormData | null>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [newUsageInstruction, setNewUsageInstruction] = useState("")
  const [newStorageInstruction, setNewStorageInstruction] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [editImageData, setEditImageData] = useState({ alt_text: '', type: '' })

  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    setIsClient(true)
    if (params.id) {
      loadProduct(params.id as string)
    }
  }, [params.id])

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true)

      // Fetch product data
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) {
        throw new Error('Không tìm thấy sản phẩm')
      }

      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true })

      if (imagesError) {
        console.error('Error fetching images:', imagesError)
      }

      // Convert images with public URLs
      const imagesWithUrls = imagesData?.map((img) => ({
        ...img,
        publicUrl: supabase.storage.from('hutieu').getPublicUrl(img.image_url).data.publicUrl,
      })) || []

      setProduct({
        name: productData.name || '',
        slug: productData.slug || '',
        description: productData.description || '',
        short_description: productData.short_description || '',
        price: productData.price || 0,
        sale_price: productData.sale_price,
        sku: productData.sku || '',
        stock_quantity: productData.stock_quantity || 0,
        status: productData.status || 'active',
        featured: productData.featured || false,
        ingredients: productData.ingredients || '',
        usage_instructions: productData.usage_instructions ?
          (Array.isArray(productData.usage_instructions) ? productData.usage_instructions : [productData.usage_instructions]) : [],
        storage_instructions: productData.storage_instructions ?
          (Array.isArray(productData.storage_instructions) ? productData.storage_instructions : [productData.storage_instructions]) : [],
        meta_title: productData.meta_title || '',
        meta_description: productData.meta_description || '',
        color: productData.color || '#10b981'
      })

      setImages(imagesWithUrls)

    } catch (error) {
      console.error('Error loading product:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin sản phẩm",
        variant: "destructive"
      })
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setProduct(prev => prev ? { ...prev, [field]: value } : null)
  }

  const addUsageInstruction = () => {
    if (newUsageInstruction.trim() && product) {
      setProduct(prev => prev ? {
        ...prev,
        usage_instructions: [...prev.usage_instructions, newUsageInstruction.trim()]
      } : null)
      setNewUsageInstruction("")
    }
  }

  const removeUsageInstruction = (index: number) => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        usage_instructions: prev.usage_instructions.filter((_, i) => i !== index)
      } : null)
    }
  }

  const addStorageInstruction = () => {
    if (newStorageInstruction.trim() && product) {
      setProduct(prev => prev ? {
        ...prev,
        storage_instructions: [...prev.storage_instructions, newStorageInstruction.trim()]
      } : null)
      setNewStorageInstruction("")
    }
  }

  const removeStorageInstruction = (index: number) => {
    if (product) {
      setProduct(prev => prev ? {
        ...prev,
        storage_instructions: prev.storage_instructions.filter((_, i) => i !== index)
      } : null)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSave = async () => {
    if (!product) return

    try {
      setSaving(true)

      const updateData = {
        name: product.name,
        slug: product.slug || generateSlug(product.name),
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        sale_price: product.sale_price,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        status: product.status,
        featured: product.featured,
        ingredients: product.ingredients,
        usage_instructions: product.usage_instructions,
        storage_instructions: product.storage_instructions,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        color: product.color,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', params.id)

      if (error) {
        throw error
      }

      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật"
      })

      router.push('/admin/products')

    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu sản phẩm",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const reloadImages = async () => {
    try {
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', params.id)
        .order('sort_order', { ascending: true })

      if (imagesData) {
        const imagesWithUrls = imagesData.map((img) => ({
          ...img,
          publicUrl: supabase.storage.from('hutieu').getPublicUrl(img.image_url).data.publicUrl,
        }))
        setImages(imagesWithUrls)
      }
    } catch (error) {
      console.error('Error reloading images:', error)
    }
  }

  const setPrimaryImage = async (imageId: string) => {
    try {
      // Call API endpoint
      const response = await fetch('/api/admin/set-primary-image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: params.id,
          imageId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Lỗi khi cập nhật hình ảnh chính')
      }

      await reloadImages()

      toast({
        title: "Thành công",
        description: "Đã cập nhật hình ảnh chính"
      })

    } catch (error) {
      console.error('Error setting primary image:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hình ảnh chính",
        variant: "destructive"
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !params.id) return

    try {
      setUploadingImage(true)
      const file = files[0]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file hình ảnh",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước file không được vượt quá 5MB",
          variant: "destructive"
        })
        return
      }

      const imageType = 'dish_1' // Default type for new uploads
      const altText = `${product?.name || 'Product'} image`
      const isPrimary = images.length === 0 // Make primary if it's the first image

      await uploadProductImage(params.id as string, file, imageType, altText, isPrimary)
      await reloadImages()

      toast({
        title: "Thành công",
        description: "Hình ảnh đã được tải lên thành công"
      })

      // Clear the input
      event.target.value = ''

    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải lên hình ảnh",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return

    try {
      await deleteProductImage(imageId)
      await reloadImages()

      toast({
        title: "Thành công",
        description: "Hình ảnh đã được xóa"
      })

    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa hình ảnh",
        variant: "destructive"
      })
    }
  }

  const startEditImage = (image: ProductImage) => {
    setEditingImage(image.id)
    setEditImageData({
      alt_text: image.alt_text || '',
      type: image.type || 'dish_1'
    })
  }

  const handleUpdateImage = async () => {
    if (!editingImage) return

    try {
      await updateImageInfo(editingImage, editImageData.alt_text, editImageData.type)
      await reloadImages()
      setEditingImage(null)

      toast({
        title: "Thành công",
        description: "Thông tin hình ảnh đã được cập nhật"
      })

    } catch (error) {
      console.error('Error updating image:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin hình ảnh",
        variant: "destructive"
      })
    }
  }

  if (!isClient) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600 font-merriweather">Đang tải sản phẩm...</span>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 font-merriweather">Không tìm thấy sản phẩm</p>
            <Button
              onClick={() => router.push('/admin/products')}
              className="mt-4"
            >
              Quay lại danh sách
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/products')}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold font-montserrat text-gray-800 truncate">
                Chỉnh sửa sản phẩm
              </h1>
              <p className="text-gray-600 font-merriweather text-sm truncate">ID: {params.id}</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => window.open(`/san-pham/${product.slug}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Xem trước</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              <span className="sm:hidden">{saving ? '...' : 'Lưu'}</span>
            </Button>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Product Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tên sản phẩm *</Label>
                    <Input
                      id="name"
                      value={product.name}
                      onChange={(e) => {
                        handleInputChange('name', e.target.value)
                        handleInputChange('slug', generateSlug(e.target.value))
                      }}
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={product.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Mã sản phẩm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={product.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="duong-dan-san-pham"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Mô tả ngắn</Label>
                  <Textarea
                    id="short_description"
                    value={product.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    placeholder="Mô tả ngắn về sản phẩm"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về sản phẩm"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Giá & Kho hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Giá gốc (VND) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={product.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sale_price">Giá khuyến mãi (VND)</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      value={product.sale_price || ''}
                      onChange={(e) => handleInputChange('sale_price', e.target.value ? Number(e.target.value) : null)}
                      placeholder="Để trống nếu không có"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Số lượng tồn kho</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={product.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Chi tiết sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ingredients">Thành phần</Label>
                  <Textarea
                    id="ingredients"
                    value={product.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    placeholder="Liệt kê thành phần sản phẩm"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Hướng dẫn sử dụng</Label>
                  <div className="space-y-2">
                    {product.usage_instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 justify-between">
                          {instruction}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUsageInstruction(index)}
                            className="h-4 w-4 p-0 hover:bg-red-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newUsageInstruction}
                        onChange={(e) => setNewUsageInstruction(e.target.value)}
                        placeholder="Thêm hướng dẫn sử dụng..."
                        onKeyPress={(e) => e.key === 'Enter' && addUsageInstruction()}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addUsageInstruction}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Hướng dẫn bảo quản</Label>
                  <div className="space-y-2">
                    {product.storage_instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 justify-between">
                          {instruction}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStorageInstruction(index)}
                            className="h-4 w-4 p-0 hover:bg-red-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newStorageInstruction}
                        onChange={(e) => setNewStorageInstruction(e.target.value)}
                        placeholder="Thêm hướng dẫn bảo quản..."
                        onKeyPress={(e) => e.key === 'Enter' && addStorageInstruction()}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addStorageInstruction}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Cài đặt SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Tiêu đề SEO</Label>
                  <Input
                    id="meta_title"
                    value={product.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="Tiêu đề hiển thị trên Google"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Mô tả SEO</Label>
                  <Textarea
                    id="meta_description"
                    value={product.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Mô tả hiển thị trên Google"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Images */}
          <div className="space-y-6">
            {/* Product Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Cài đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={product.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm ngừng</SelectItem>
                      <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Sản phẩm nổi bật</Label>
                  <Switch
                    id="featured"
                    checked={product.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="color">Màu chủ đạo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={product.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-12 h-10 p-1 flex-shrink-0"
                    />
                    <Input
                      value={product.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="#10b981"
                      className="flex-1 min-w-0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-montserrat flex items-center justify-between">
                  Hình ảnh sản phẩm
                  <Badge variant="secondary">{images.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center space-y-2 ${uploadingImage ? 'opacity-50' : ''}`}
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {uploadingImage ? 'Đang tải lên...' : 'Tải lên hình ảnh mới'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (tối đa 5MB)</p>
                    </div>
                  </label>
                </div>

                {/* Images List */}
                {images.length > 0 ? (
                  <div className="space-y-4">
                    {images.map((image) => (
                      <div key={image.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                            <img
                              src={image.publicUrl}
                              alt={image.alt_text || 'Product image'}
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />
                            {image.is_primary && (
                              <Badge className="absolute -top-1 -right-1 bg-emerald-600 text-xs">
                                Chính
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 min-w-0">
                            {editingImage === image.id ? (
                              <div className="space-y-2">
                                <Input
                                  placeholder="Alt text"
                                  value={editImageData.alt_text}
                                  onChange={(e) => setEditImageData(prev => ({ ...prev, alt_text: e.target.value }))}
                                  className="text-sm"
                                />
                                <Select
                                  value={editImageData.type}
                                  onValueChange={(value) => setEditImageData(prev => ({ ...prev, type: value }))}
                                >
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="background">Background</SelectItem>
                                    <SelectItem value="product_front">Product Front</SelectItem>
                                    <SelectItem value="product_back">Product Back</SelectItem>
                                    <SelectItem value="dish_1">Dish 1</SelectItem>
                                    <SelectItem value="dish_2">Dish 2</SelectItem>
                                    <SelectItem value="gallery">Gallery</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={handleUpdateImage}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    Lưu
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingImage(null)}
                                  >
                                    Hủy
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {image.alt_text || 'Không có alt text'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  <strong>Loại:</strong> {image.type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  <strong>Thứ tự:</strong> {image.sort_order}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingImage !== image.id && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                            {!image.is_primary && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPrimaryImage(image.id)}
                                className="flex items-center gap-1 text-xs"
                              >
                                <Upload className="w-3 h-3" />
                                <span className="hidden sm:inline">Đặt làm chính</span>
                                <span className="sm:hidden">Chính</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditImage(image)}
                              className="flex items-center gap-1 text-xs"
                            >
                              <Edit className="w-3 h-3" />
                              <span className="hidden sm:inline">Sửa</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Xóa</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Chưa có hình ảnh nào</p>
                    <p className="text-sm">Tải lên hình ảnh đầu tiên</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}