import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeInImage } from "@/components/fade-in-image";
import { Header } from "@/components/header";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Định nghĩa interface cho Product dựa trên schema của bảng products
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  sku: string;
  stock_quantity: number;
  status: "active" | "inactive" | "out_of_stock";
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

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string; // Path từ bucket 'hutieu'
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
  type: "background" | "dish_1" | "product_front" | "product_back" | "dish_2"; // Loại ảnh
  publicUrl?: string; // Thêm thuộc tính tạm để lưu URL công khai
}

export default async function ChiTietSanPhamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Truy vấn sản phẩm từ bảng products dựa trên id
  const { slug } = await params;
  const { data: productData, error: productError } = await supabase
    .from("products")
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
    .eq("slug", slug)
    .eq("status", "active")
    .single(); // Sử dụng single để lấy 1 bản ghi

  if (productError || !productData) {
    console.error("Error fetching product:", productError);
    return <div>Lỗi khi tải sản phẩm. Vui lòng thử lại sau.</div>;
  }

  // Truy vấn ảnh sản phẩm từ bảng product_images
  const { data: productImages, error: imagesError } = await supabase
    .from("product_images")
    .select(`
      id,
      product_id,
      image_url,
      alt_text,
      is_primary,
      type
    `)
    .eq("product_id", productData.id)
    .order("sort_order", { ascending: true });

  if (imagesError) {
    console.error("Error fetching product images:", imagesError);
  }

  // Chuyển path thành URL công khai từ bucket 'hutieu'
  const imagesWithUrls = productImages?.map((img) => ({
    ...img,
    publicUrl: supabase.storage.from("hutieu").getPublicUrl(img.image_url).data
      .publicUrl,
  })) || [];

  // Lấy ảnh dựa trên type
  const getImageByType = (type: ProductImage["type"]) =>
    imagesWithUrls.find((img) => img.type === type)?.publicUrl ||
    "/placeholder.svg?height=400&width=400";

  const product = {
    ...productData,
    alt: imagesWithUrls.length > 0 ? imagesWithUrls[0].alt_text || productData.name : productData.name,
    usage: (productData.usage_instructions || "").split("\n").filter(Boolean), // Chuyển thành mảng
    storage: (productData.storage_instructions || "").split("\n").filter(Boolean), // Chuyển thành mảng
    safety: ["Không chất bảo quản", "An toàn thực phẩm", "Nguyên liệu tự nhiên"], // Giả lập
    standards: ["Đạt tiêu chuẩn VSATTP", "Sản xuất khép kín", "100% sạch"], // Giả lập
    certifications: ["Chứng nhận HACCP", "Chứng nhận OCOP 3 sao", "Chứng nhận VSATTP"], // Giả lập
  };

  const retailers = [
    { name: "Bách hóa XANH", logo: "/placeholder.svg?height=60&width=120&text=Bách+hóa+XANH" },
    { name: "Co.opmart", logo: "/placeholder.svg?height=60&width=120&text=Co.opmart" },
    { name: "Co.opmart", logo: "/placeholder.svg?height=60&width=120&text=Co.opmart+2" },
    { name: "Siêu thị", logo: "/placeholder.svg?height=60&width=120&text=Siêu+thị" },
    { name: "WinMart", logo: "/placeholder.svg?height=60&width=120&text=WinMart" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{product.name} - Mẹ Sin</title>
        <meta name="description" content={product.description || ""} />
      </Head>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <svg viewBox="0 0 400 400" className="w-full h-full text-emerald-400 opacity-10">
              <path d="M0,100 Q200,0 400,100 L400,400 L0,400 Z" fill="currentColor" />
            </svg>
          </div>
          <FadeInImage
            src={getImageByType("background")}
            alt={`${product.name} Hero`}
            fill={true}
            className="object-cover opacity-20 mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 py-24 pt-28">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              {product.name}
              <br />
              <span className="text-amber-300">Mẹ Sin</span>
            </h1>
            <p className="text-lg mb-8 opacity-90 font-merriweather">
              Tinh hoa ẩm thực từ gạo Việt - Chất lượng hàng đầu từ truyền thống gia đình
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span className="text-sm font-open-sans">Tự nhiên 100%</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                <span className="text-sm font-open-sans">VSATTP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
                SẢN PHẨM NỔI BẬT
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-gray-800">
                {product.name}
              </h2>
              <p className="text-emerald-600 font-semibold mb-6 font-open-sans text-lg">
                Tinh hoa ẩm thực từ gạo Việt
              </p>
              <div className="text-gray-700 space-y-4 font-merriweather leading-relaxed">
                <p>{product.description}</p>
                <p>
                  Với mỗi {product.name.toLowerCase()}, bạn sẽ cảm nhận được hương vị
                  đậm đà của gạo Việt. Sản phẩm có thể sử dụng để chế biến nhiều món
                  ăn ngon theo sở thích của gia đình.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-100">
                <FadeInImage
                  src={getImageByType("dish_1")}
                  alt={`${product.name} Product`}
                  fill={true}
                  className="object-cover"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  HOT
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Information Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-gray-800">
              Thông tin chi tiết sản phẩm
            </h2>
            <p className="text-gray-600 font-merriweather text-lg max-w-2xl mx-auto">
              Tìm hiểu thêm về thành phần, cách sử dụng và chứng nhận chất lượng của {product.name}
            </p>
          </div>

          {/* Product Images - Center Section */}
          <div className="flex justify-center mb-16">
            <div className="grid grid-cols-3 gap-6 max-w-4xl">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-emerald-100">
                <FadeInImage
                  src={getImageByType("product_front")}
                  alt={`${product.name} Package Front`}
                  fill={true}
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-emerald-100">
                <FadeInImage
                  src={getImageByType("dish_1")}
                  alt={`${product.name} Prepared Dish`}
                  fill={true}
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-emerald-100">
                <FadeInImage
                  src={getImageByType("product_back")}
                  alt={`${product.name} Package Back`}
                  fill={true}
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Product Information Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Thành phần */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100 shadow-sm h-fit">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🌾</span>
                </div>
                <h3 className="text-lg font-bold font-montserrat text-gray-800">Thành phần</h3>
              </div>
              <p className="text-gray-700 font-merriweather text-sm leading-relaxed">
                {product.ingredients || "Gạo tết Việt Nam, nước sạch, không chất bảo quản"}
              </p>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm h-fit">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">👨‍🍳</span>
                </div>
                <h3 className="text-lg font-bold font-montserrat text-gray-800">
                  Hướng dẫn sử dụng
                </h3>
              </div>
              <div className="text-gray-700 font-merriweather text-sm space-y-1 leading-relaxed">
                {product.usage.length > 0 ? (
                  product.usage.map((item, index) => (
                    <p key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2 mt-0.5 text-xs">•</span>
                      <span>{item}</span>
                    </p>
                  ))
                ) : (
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-2 mt-0.5 text-xs">•</span>
                    <span>Nấu với nước sôi trong 3-5 phút</span>
                  </p>
                )}
              </div>
            </div>

            {/* Hướng dẫn bảo quản */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm h-fit">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">❄️</span>
                </div>
                <h3 className="text-lg font-bold font-montserrat text-gray-800">
                  Hướng dẫn bảo quản
                </h3>
              </div>
              <div className="text-gray-700 font-merriweather text-sm space-y-1 leading-relaxed">
                {product.storage.length > 0 ? (
                  product.storage.map((item, index) => (
                    <p key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-0.5 text-xs">•</span>
                      <span>{item}</span>
                    </p>
                  ))
                ) : (
                  <p className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5 text-xs">•</span>
                    <span>Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Certifications */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">💚</span>
                </div>
                <h3 className="text-xl font-bold font-montserrat text-gray-800">
                  Sản phẩm an toàn
                </h3>
              </div>
              <div className="text-gray-700 font-merriweather space-y-2 leading-relaxed">
                {product.safety.map((item, index) => (
                  <p key={index} className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">🏆</span>
                </div>
                <h3 className="text-xl font-bold font-montserrat text-gray-800">
                  Chứng nhận sản phẩm
                </h3>
              </div>
              <div className="text-gray-700 font-merriweather space-y-2 leading-relaxed">
                {product.certifications.map((item, index) => (
                  <p key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <FadeInImage
                src={getImageByType("dish_2")}
                alt={`${product.name} với nguyên liệu`}
                fill={true}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 font-montserrat">{product.name}</h2>
              <p className="font-semibold mb-6 font-open-sans">
                Tinh hoa ẩm thực từ gạo Việt
              </p>
              <p className="text-gray-700 font-merriweather leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where to Buy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              Sản phẩm được phân phối ở đâu?
            </h2>
            <p className="text-gray-600 font-merriweather">
              Sản phẩm của Mẹ Sin có mặt ở hầu hết các hệ thống siêu thị, cửa hàng tiện
              lợi và các cửa hàng bán lẻ trên toàn quốc.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {retailers.map((retailer, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 flex items-center justify-center h-16">
                  <FadeInImage
                    src={retailer.logo}
                    alt={retailer.name}
                    fill={true}
                    className="object-contain"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              Dành cho khách sỉ và nhà phân phối
            </h2>
            <p className="text-gray-600 font-merriweather max-w-3xl mx-auto">
              Mẹ Sin luôn mở rộng hệ thống phân phối và tìm kiếm các đối tác chiến lược
              trên toàn quốc. Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất
              với chính sách hỗ trợ tốt nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    className="bg-gradient-to-br from-emerald-100 to-emerald-200"
                  >
                    <span className="font-bold text-lg">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold font-montserrat">Liên hệ hợp tác</h3>
                </div>
                <div className="space-y-3 text-gray-600 font-merriweather">
                  <p>• Hỗ trợ kinh doanh 24/7</p>
                  <p>• Chính sách giá ưu đãi</p>
                  <p>• Hỗ trợ marketing và quảng bá</p>
                  <p>• Đào tạo nhân viên bán hàng</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    className="bg-gradient-to-br from-emerald-100 to-emerald-200"
                  >
                    <span className="font-bold text-lg">🏪</span>
                  </div>
                  <h3 className="text-xl font-bold font-montserrat">Sỉ đại lý toàn quốc</h3>
                </div>
                <div className="space-y-3 text-gray-600 font-merriweather">
                  <p>• Giá sỉ cạnh tranh nhất thị trường</p>
                  <p>• Giao hàng nhanh chóng toàn quốc</p>
                  <p>• Chính sách đổi trả linh hoạt</p>
                  <p>• Hỗ trợ vận chuyển miễn phí</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 font-montserrat">
                Bắt đầu hợp tác ngay hôm nay
              </h3>
              <p className="text-gray-600 mb-6 font-merriweather">
                Liên hệ với chúng tôi để được tư vấn chi tiết về chương trình hợp tác
                và nhận báo giá tốt nhất
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="px-8 py-3 font-open-sans bg-emerald-600 hover:bg-emerald-700">
                  ĐẶT HÀNG SỈ
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-3 font-open-sans border-emerald-600 hover:bg-emerald-50"
                >
                  TƯ VẤN MIỄN PHÍ
                </Button>
              </div>
              <div className="mt-6 text-sm text-gray-500 font-merriweather">
                <p>
                  Hotline: <span className="font-semibold">0913 788 789</span>
                </p>
                <p>
                  Email: <span className="font-semibold">sauthanh.info@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">ST</span>
                </div>
                <span className="font-bold text-xl">Mẹ Sin</span>
              </div>
              <div className="space-y-2 text-sm text-gray-400 font-merriweather">
                <p className="font-semibold text-white">
                  Cơ sở sản xuất bún - hủ tiếu Mẹ Sin
                </p>
                <p>
                  Địa chỉ: Ấp Bình Hòa, xã Long Bình Điền, huyện Chợ Gạo, tỉnh Tiền
                  Giang, Việt Nam
                </p>
                <p>Điện thoại: 0815 771 771 - 0911 288 338</p>
                <p>Email: sauthanh.info@gmail.com</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-montserrat">Menu chính</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Hoạt động
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Chính sách bán hàng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-montserrat">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Bún tươi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Hủ tiếu tươi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Bánh tráng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Bún khô cuộn lá
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-montserrat">Kết nối với chúng tôi</h4>
              <div className="flex space-x-4 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">y</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 font-merriweather">
                <p>Bản quyền nội dung thuộc về Mẹ Sin</p>
                <p>Bản quyền hình ảnh thuộc về các tác giả</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400 font-merriweather">
            <p>Bản quyền © Hủ tiếu Mẹ Sin © 2023</p>
            <p>
              Bản quyền nội dung thuộc về Mẹ Sin và các cộng tác viên - Cấm sao chép
              dưới mọi hình thức khi chưa có sự đồng ý của tác giả
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}