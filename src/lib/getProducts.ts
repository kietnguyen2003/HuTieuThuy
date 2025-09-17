import { supabase } from './supabase';

// Định nghĩa interface cho Product và ProductImage
export interface Product {
  alt: string;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  sku: string;
  stock_quantity: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  ingredients: string | null;
  usage_instructions: string | null;
  storage_instructions: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  color: string;
}

export interface ProductWithImage extends Product {
  image: string;
  alt: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
  publicUrl?: string;
}

// Hàm lấy dữ liệu sản phẩm và ảnh
export async function fetchProductsWithImages() {
  try {
    // Lấy dữ liệu sản phẩm từ bảng products
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
        meta_title,
        meta_description,
        color
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error('Lỗi khi tải sản phẩm');
    }

    // Lấy ảnh sản phẩm từ bảng product_images
    const productIds = products.map((p) => p.id);
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
      .eq('type', 'background')
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.error('Error fetching product images:', imagesError);
      throw new Error('Lỗi khi tải ảnh sản phẩm');
    }

    // Chuyển path thành URL công khai từ bucket 'hutieu'
    const imagesWithUrls = productImages?.map((img) => ({
      ...img,
      publicUrl: supabase.storage.from('hutieu').getPublicUrl(img.image_url).data.publicUrl,
    })) || [];

    // Gán ảnh cho từng sản phẩm (ưu tiên ảnh primary)
    const productsWithImages = products.map((product) => {
      const images = imagesWithUrls.filter((img) => img.product_id === product.id) || [];
      const primaryImage = images.find((img) => img.is_primary) || images[0];

      return {
        ...product,
        image: primaryImage?.publicUrl || `/placeholder.svg?height=300&width=300`,
        alt: primaryImage?.alt_text || product.name,
        color: product.color || '#000000',
      };
    });

    // Lấy ảnh hero
    const heroImage = await supabase.storage
      .from('hutieu')
      .getPublicUrl('hu-tieu-kho-5.jpg').data.publicUrl || '/placeholder.svg?height=600&width=1200';
    const heroImageMain = await supabase.storage
      .from('hutieu')
      .getPublicUrl('hero-main.jpg').data.publicUrl || '/placeholder.svg?height=400&width=400';

    return {
      products: productsWithImages as ProductWithImage[],
      heroImage,
      heroImageMain,
    };
  } catch (error) {
    console.error('Error in fetchProductsWithImages:', error);
    throw error;
  }
}

export async function fetchProductsWithImagesAndDescription() {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        short_description,
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

  } catch (error) {
    console.error('Error in fetchProductsWithImagesAndDescription:', error);
    throw error;
  }
    
}