import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FadeInImage } from "@/components/fade-in-image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrderForm } from "@/components/order-form"
import { MapPin, Clock, Mail, Phone, ShoppingCart } from "lucide-react"
import { fetchProductsWithImages } from "@/lib/getProducts"

export default async function LienHePage() {
  const products = await fetchProductsWithImages();
  return (
    <div className="min-h-screen bg-white">
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
        </div>
        <div className="relative container mx-auto px-4 py-24 pt-28">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Liên hệ với
              <br />
              <span className="text-amber-300">Mẹ Sin</span>
            </h1>
            <p className="text-lg mb-8 opacity-90 font-merriweather">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-open-sans">0911 288 338</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-open-sans">mesin@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Information */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat text-gray-800">Thông tin liên hệ</h2>
                <p className="text-gray-600 font-merriweather leading-relaxed">Chúng tôi có nhiều kênh liên lạc để phục vụ bạn một cách tốt nhất</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Address */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 font-montserrat text-gray-800">ĐỊA CHỈ</h3>
                    <div className="text-sm text-gray-600 font-merriweather space-y-1">
                      <p>Văn phòng và xưởng SX</p>
                      <p>Ấp Bình Hòa, xã Long Bình Điền</p>
                      <p>H. Chợ Gạo, T. Tiền Giang</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 font-montserrat text-gray-800">THỜI GIAN LÀM VIỆC</h3>
                    <div className="text-sm text-gray-600 font-merriweather space-y-1">
                      <p>Từ thứ Hai đến thứ Bảy</p>
                      <p>Từ 6 giờ đến 17 giờ</p>
                      <p>Chủ Nhật nghỉ</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 font-montserrat text-gray-800">EMAIL VÀ NHẬN TIN</h3>
                    <div className="text-sm text-gray-600 font-merriweather space-y-1">
                      <p>Email: mesin@gmail.com</p>
                      <p>Nhận tin: mesin@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 font-montserrat text-gray-800">ĐIỆN THOẠI VÀ ZALO</h3>
                    <div className="text-sm text-gray-600 font-merriweather space-y-1">
                      <p>Hotline: 0911 288 338</p>
                      <p>Điện thoại: 0815 771 771 - 0911 288 338</p>
                      <p>Zalo: 0911 288 338</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat text-gray-800">Đặt hàng</h2>
                <p className="text-gray-600 font-merriweather leading-relaxed">
                  Điền thông tin đặt hàng, chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất
                </p>
              </div>

              <OrderForm products={products.products} />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat text-gray-800">Tìm chúng tôi tại</h2>
            <p className="text-gray-600 font-merriweather">Ghé thăm cơ sở sản xuất của chúng tôi</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100" style={{ height: "450px" }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5697.992198605185!2d106.4479293!3d10.3646015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aad3a3ca53c35%3A0x8188a3907713bee7!2zQ1RZIFROSEggU1ggVE0gVEjhu6ZZIENI4buiIEfhuqBP!5e1!3m2!1svi!2s!4v1753350006920!5m2!1svi!2s" 
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hủ tiếu Thủy"
            />
          </div>
          <div className="mt-8 text-center">
            <Card className="inline-block p-6 bg-white shadow-xl border border-emerald-100">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">MS</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base font-montserrat text-gray-800">Bún - Hủ tiếu Mẹ Sin</h3>
                    <p className="text-sm text-gray-600 font-merriweather">Ấp Bình Hòa, xã Long Bình Điền, H. Chợ Gạo, Tiền Giang</p>
                    <div className="flex items-center mt-2">
                      <div className="flex text-amber-400 text-sm">★★★★★</div>
                      <span className="text-sm text-gray-500 ml-2 font-open-sans">4.8 (124 đánh giá)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer products={products.products} />
    </div>
  )
}
