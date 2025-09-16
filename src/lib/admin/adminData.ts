"use client"

import { createClient } from '../supabase/client'
import type { Product, ProductImage } from '../getProducts'

export interface AdminProductWithImage extends Product {
  image: string
  category: string
  totalImages: number
}

export async function fetchAdminProducts(): Promise<AdminProductWithImage[]> {
  const supabase = createClient()

  try {
    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        short_description,
        price,
        sale_price,
        sku,
        stock_quantity,
        status,
        featured,
        ingredients,
        usage_instructions,
        storage_instructions,
        meta_title,
        meta_description,
        created_at,
        updated_at,
        color
      `)
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('Error fetching products:', productsError)
      throw new Error('Lỗi khi tải sản phẩm')
    }

    if (!products || products.length === 0) {
      return []
    }

    // Fetch product images
    const productIds = products.map(p => p.id)
    const { data: productImages, error: imagesError } = await supabase
      .from('product_images')
      .select(`
        id,
        product_id,
        image_url,
        alt_text,
        is_primary,
        type
      `)
      .in('product_id', productIds)
      .order('sort_order', { ascending: true })

    if (imagesError) {
      console.error('Error fetching product images:', imagesError)
      // Don't throw error for images, just log it
    }

    // Convert to public URLs
    const imagesWithUrls = productImages?.map((img) => ({
      ...img,
      publicUrl: supabase.storage.from('hutieu').getPublicUrl(img.image_url).data.publicUrl,
    })) || []

    // Combine products with images
    const productsWithImages = products.map((product) => {
      const images = imagesWithUrls.filter((img) => img.product_id === product.id)
      const primaryImage = images.find((img) => img.is_primary) || images[0]

      // Determine category based on product name
      let category = 'Khác'
      if (product.name.toLowerCase().includes('bún')) category = 'Bún'
      else if (product.name.toLowerCase().includes('hủ tiếu')) category = 'Hủ tiếu'
      else if (product.name.toLowerCase().includes('phở')) category = 'Phở'
      else if (product.name.toLowerCase().includes('bánh')) category = 'Bánh'

      return {
        ...product,
        alt: primaryImage?.alt_text || product.name,
        image: primaryImage?.publicUrl || `/placeholder.svg?height=300&width=300`,
        category,
        totalImages: images.length
      }
    })

    return productsWithImages as AdminProductWithImage[]
  } catch (error) {
    console.error('Error in fetchAdminProducts:', error)
    throw error
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const supabase = createClient()

  try {
    // First delete product images
    const { error: imagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId)

    if (imagesError) {
      console.error('Error deleting product images:', imagesError)
      throw new Error('Lỗi khi xóa ảnh sản phẩm')
    }

    // Then delete the product
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (productError) {
      console.error('Error deleting product:', productError)
      throw new Error('Lỗi khi xóa sản phẩm')
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    throw error
  }
}

export async function updateProductStatus(productId: string, status: 'active' | 'inactive' | 'out_of_stock'): Promise<void> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('products')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (error) {
      console.error('Error updating product status:', error)
      throw new Error('Lỗi khi cập nhật trạng thái sản phẩm')
    }
  } catch (error) {
    console.error('Error in updateProductStatus:', error)
    throw error
  }
}

export async function getAdminStats() {
  const supabase = createClient()

  try {
    // Get total products count
    const { count: totalProducts, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productsError) {
      console.error('Error fetching products count:', productsError)
    }

    // Get active products count
    const { count: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (activeError) {
      console.error('Error fetching active products count:', activeError)
    }

    // Get out of stock products count
    const { count: outOfStockProducts, error: outOfStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'out_of_stock')

    if (outOfStockError) {
      console.error('Error fetching out of stock products count:', outOfStockError)
    }

    // Get total images count
    const { count: totalImages, error: imagesError } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true })

    if (imagesError) {
      console.error('Error fetching images count:', imagesError)
    }

    return {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      outOfStockProducts: outOfStockProducts || 0,
      totalImages: totalImages || 0
    }
  } catch (error) {
    console.error('Error in getAdminStats:', error)
    return {
      totalProducts: 0,
      activeProducts: 0,
      outOfStockProducts: 0,
      totalImages: 0
    }
  }
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const supabase = createClient()

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      throw new Error('Lỗi khi tải sản phẩm')
    }

    return product
  } catch (error) {
    console.error('Error in fetchProductById:', error)
    return null
  }
}

export async function updateProduct(productId: string, updateData: Partial<Product>): Promise<void> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (error) {
      console.error('Error updating product:', error)
      throw new Error('Lỗi khi cập nhật sản phẩm')
    }
  } catch (error) {
    console.error('Error in updateProduct:', error)
    throw error
  }
}

export async function fetchProductImages(productId: string) {
  const supabase = createClient()

  try {
    const { data: images, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching product images:', error)
      throw new Error('Lỗi khi tải hình ảnh sản phẩm')
    }

    // Convert to public URLs
    const imagesWithUrls = images?.map((img) => ({
      ...img,
      publicUrl: supabase.storage.from('hutieu').getPublicUrl(img.image_url).data.publicUrl,
    })) || []

    return imagesWithUrls
  } catch (error) {
    console.error('Error in fetchProductImages:', error)
    throw error
  }
}

export async function updateImagePrimary(productId: string, imageId: string): Promise<void> {
  const supabase = createClient()

  try {
    // Set all images to non-primary
    await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId)

    // Set selected image as primary
    const { error } = await supabase
      .from('product_images')
      .update({ is_primary: true })
      .eq('id', imageId)

    if (error) {
      console.error('Error updating primary image:', error)
      throw new Error('Lỗi khi cập nhật hình ảnh chính')
    }
  } catch (error) {
    console.error('Error in updateImagePrimary:', error)
    throw error
  }
}

export async function uploadProductImage(
  productId: string,
  file: File,
  imageType: string,
  altText?: string,
  isPrimary: boolean = false
): Promise<string> {
  try {
    // Get auth headers
    const { getAuthHeaders } = await import('@/lib/auth/client')
    const authHeaders = await getAuthHeaders()

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('productId', productId)
    formData.append('imageType', imageType)
    formData.append('altText', altText || '')
    formData.append('isPrimary', isPrimary.toString())

    console.log('Uploading image:', {
      productId,
      imageType,
      fileName: file.name,
      fileSize: file.size,
      isPrimary,
      hasAuth: Object.keys(authHeaders).length > 0
    })

    // Call API endpoint
    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      headers: authHeaders,
      body: formData
    })

    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text()
      console.error('API returned HTML instead of JSON:', htmlText.substring(0, 200))
      throw new Error('Lỗi server: API endpoint không hoạt động đúng. Vui lòng kiểm tra console.')
    }

    let result
    try {
      result = await response.json()
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      const responseText = await response.text()
      console.error('Raw response:', responseText)
      throw new Error('Lỗi parse JSON response từ server')
    }

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: Lỗi khi tải ảnh lên`)
    }

    return result.imageId
  } catch (error) {
    console.error('Error in uploadProductImage:', error)
    throw error
  }
}

export async function deleteProductImage(imageId: string): Promise<void> {
  try {
    // Call API endpoint
    const response = await fetch(`/api/admin/delete-image?imageId=${imageId}`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Lỗi khi xóa hình ảnh')
    }
  } catch (error) {
    console.error('Error in deleteProductImage:', error)
    throw error
  }
}

export async function updateImageInfo(imageId: string, altText: string, imageType: string): Promise<void> {
  try {
    // Call API endpoint
    const response = await fetch('/api/admin/update-image', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageId,
        altText,
        imageType
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Lỗi khi cập nhật thông tin hình ảnh')
    }
  } catch (error) {
    console.error('Error in updateImageInfo:', error)
    throw error
  }
}