"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FadeInImage } from "@/components/fade-in-image"
import { Header } from "@/components/header"
import { MapPin, Clock, Mail, Phone } from "lucide-react"

export default function LienHePage() {
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

            {/* Right Column - Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat text-gray-800">Gửi tin nhắn</h2>
                <p className="text-gray-600 font-merriweather leading-relaxed">
                  Điền thông tin dưới đây, chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất
                </p>
              </div>

              <Card className="p-8 shadow-xl border border-emerald-100">
                <CardContent className="p-0">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 font-open-sans">Tên của bạn *</label>
                      <Input placeholder="Nhập họ tên của bạn" className="w-full h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 font-open-sans">
                        Email của bạn
                      </label>
                      <Input type="email" placeholder="Email của bạn (không bắt buộc)" className="w-full h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 font-open-sans">
                        Số điện thoại *
                      </label>
                      <Input type="tel" placeholder="Số điện thoại của bạn" className="w-full h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 font-open-sans">
                        Nội dung trao đổi *
                      </label>
                      <Textarea
                        placeholder="Hãy mô tả câu chuyện của bạn bằng một vài dòng ngắn gọn nhé!"
                        rows={5}
                        className="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                      />
                    </div>

                    <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-open-sans text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      GỬI THÔNG TIN
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">ST</span>
                </div>
                <span className="font-bold text-xl">Thủy</span>
              </div>
              <div className="space-y-2 text-xs text-gray-400 font-merriweather">
                <p className="font-semibold text-white">Cơ sở sản xuất hủ tiếu Thủy</p>
                <p>Địa chỉ: Ấp Bình Hòa, xã Long Bình Điền</p>
                <p>H. Chợ Gạo, Tiền Giang</p>
                <p>Điện thoại: 0815 771 771 - 0911 288 338</p>
                <p>Email: mesin@gmail.com</p>
                <p>Giấy CN ĐKKD: số 0048.001.025/FSMS</p>
                <p>Cấp 23/6/2025 tại UBND H. Chợ Gạo, Tiền Giang</p>
              </div>
            </div>

            {/* Menu chính */}
            <div>
              <h4 className="font-semibold mb-4 font-montserrat">Menu chính</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/" className="hover:text-white font-open-sans">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Hoạt động
                  </a>
                </li>
                <li>
                  <a href="/lien-he" className="hover:text-white font-open-sans">
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

            {/* Sản phẩm */}
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
                    Bánh lăm bí
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white font-open-sans">
                    Bún tươi xanh lá
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media & Copyright */}
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
                <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">z</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 font-merriweather space-y-2">
                <p>Bún - Hủ tiếu Thủy © 2025</p>
                <p>Bản quyền nội dung thuộc về Thủy và các cộng tác viên</p>
                <p>Website được thiết kế và xây dựng bởi Key Digital</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
