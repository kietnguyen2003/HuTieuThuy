import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Truck, Heart, Clock, Users, Utensils } from "lucide-react"
import { FadeInImage } from "@/components/fade-in-image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { fetchXuongImage } from "@/lib/getXuong"
import { fetchProductsWithImages } from "@/lib/getProducts"

export default async function Component() {
  const imagesXuong = await fetchXuongImage();
  const products = await fetchProductsWithImages();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <svg viewBox="0 0 400 400" className="w-full h-full text-emerald-400 opacity-20">
              <path d="M0,100 Q200,0 400,100 L400,400 L0,400 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16 pt-20 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
                Bún - Hủ tiếu
                <br />
                <span className="text-amber-300">Mẹ Sin</span>
              </h1>
              <p className="text-lg mb-6 opacity-90 font-merriweather">
                Hương vị truyền thống Việt Nam được chế biến từ những nguyên liệu tươi ngon nhất, mang đến cho bạn trải
                nghiệm ẩm thực đích thực.
              </p>
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-open-sans">
                Đặt ngay
              </Button>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <FadeInImage
                  src="/sin.jpg"
                  alt="Bún Mẹ Sin"
                  width={400}
                  height={400}
                  className="rounded-full shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute top-4 right-4 bg-amber-400 text-emerald-700 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                Bán chạy #1
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-emerald-100 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2 font-montserrat">An toàn vệ sinh thực phẩm</h3>
                <p className="text-gray-600 text-sm font-merriweather">Đảm bảo chất lượng và an toàn</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-emerald-100 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2 font-montserrat">Chất lượng vượt trội</h3>
                <p className="text-gray-600 text-sm font-merriweather">Nguyên liệu tươi ngon hàng đầu</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-emerald-100 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2 font-montserrat">Giao hàng nhanh chóng</h3>
                <p className="text-gray-600 text-sm font-merriweather">Phục vụ tận nơi trong 30 phút</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <FadeInImage
                src={products.products[0]?.image || "/placeholder.svg?height=400&width=400"}
                alt={products.products[0]?.name || "Hủ tiếu Mẹ Sin"}
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -top-4 -right-4 bg-emerald-600 text-white px-4 py-2 rounded-full font-bold">HOT</div>
            </div>
            <div>
              <Badge className="bg-emerald-100 text-emerald-600 mb-4 font-open-sans">SẢN PHẨM</Badge>
              <h2 className="text-3xl font-bold mb-4 font-montserrat">
                {products.products[0]?.name || "Hủ tiếu"}
                <br />
                <span className="text-emerald-600">Mẹ Sin</span>
              </h2>
              <p className="text-gray-600 mb-6 font-merriweather">
                {products.products[0]?.description || "Hủ tiếu Mẹ Sin với nước dùng trong vắt được ninh từ xương heo, tôm khô và các gia vị truyền thống. Bánh hủ tiếu dai ngon, thịt heo, tôm tươi và rau sống tạo nên hương vị đặc trưng khó quên."}
              </p>
              <div className="mb-6">
                <h4 className="font-semibold mb-2 font-montserrat">Bún Thành là một trong những đặc sản nổi tiếng</h4>
                <p className="text-gray-600 text-sm font-merriweather">
                  Được chế biến theo công thức gia truyền với hơn 20 năm kinh nghiệm
                </p>
              </div>
              <Link href="/san-pham">
                <Button className="bg-emerald-600 hover:bg-emerald-700 font-open-sans">Xem thêm</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">CAM KẾT</h2>
            <p className="text-gray-600 font-merriweather">Chất lượng cho mỗi bữa ăn</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2 font-montserrat">Hương vị truyền thống</h3>
                <p className="text-gray-600 text-sm font-merriweather">Giữ nguyên hương vị Việt</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2 font-montserrat">Nhanh chóng tiện lợi</h3>
                <p className="text-gray-600 text-sm font-merriweather">Phục vụ nhanh chóng</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2 font-montserrat">Phục vụ gia đình</h3>
                <p className="text-gray-600 text-sm font-merriweather">Phù hợp mọi lứa tuổi</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2 font-montserrat">Hương vị đặc trưng</h3>
                <p className="text-gray-600 text-sm font-merriweather">Không thể quên</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SẢN PHẨM</h2>
            <p className="text-gray-600">Sản phẩm chúng tôi tự hào</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.products.map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <FadeInImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.short_description || product.description}</p>
                  <Link href={`/san-pham/${product.slug}`}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 font-open-sans">Xem thêm</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">KHU VỰC LÀM VIỆC</h2>
            <p className="text-gray-600 font-merriweather">Không gian sản xuất chuyên nghiệp và hiện đại</p>
          </div>

          {/* Grid layout optimized for 5 images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* First row: 3 images */}
            {imagesXuong.slice(0, 3).map((image, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden group shadow-lg">
                <FadeInImage
                  src={image.publicUrl}
                  alt={image.image}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                  <h3 className="text-white font-bold text-lg font-montserrat text-center">{image.description}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Second row: 2 images centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
            {imagesXuong.slice(3, 5).map((image, index) => (
              <div key={index + 3} className="relative h-64 rounded-lg overflow-hidden group shadow-lg">
                <FadeInImage
                  src={image.publicUrl}
                  alt={image.image}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                  <h3 className="text-white font-bold text-lg font-montserrat text-center">{image.description}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 font-montserrat">ĐÁNH GIÁ</h2>
              <p className="text-gray-600 font-merriweather">Từ người tiêu dùng</p>
            </div>
            <Card className="p-8 text-center">
              <CardContent>
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 mb-4 italic font-merriweather">
                  "Tôi đã ăn bún Mẹ Sin được 5 năm rồi và chưa bao giờ thất vọng. Hương vị luôn đậm đà, nguyên liệu
                  tươi ngon và phục vụ rất chu đáo."
                </p>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-semibold font-montserrat">Chị Nguyễn Thị Lan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-montserrat">
            Hãy liên lạc với chúng tôi để được tư vấn sản phẩm
          </h2>
          <p className="text-lg mb-8 opacity-90 font-merriweather">
            Đội ngũ chuyên viên sẽ tư vấn và hỗ trợ bạn chọn sản phẩm phù hợp nhất
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-open-sans">
            Liên hệ ngay
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer products={products.products} />
    </div>
  )
}
