import Link from "next/link"
import { ProductWithImage } from "@/lib/getProducts"

interface FooterProps {
  products?: ProductWithImage[]
}

export function Footer({ products = [] }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <img src="/icon.jpg" alt="Logo" className="rounded-full w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl">Mẹ Sin</span>
            </div>
            <p className="text-gray-400 text-sm font-merriweather">
              Mang đến hương vị truyền thống Việt Nam đến mọi gia đình
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-montserrat">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white font-open-sans transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-white font-open-sans transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-white font-open-sans transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-montserrat">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {products.slice(0, 4).map((product) => (
                <li key={product.id}>
                  <Link href={`/san-pham/${product.slug}`} className="hover:text-white font-open-sans transition-colors">
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-montserrat">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-merriweather">
              <li>Địa chỉ: Ấp Bình Hòa, xã Long Bình Điền, huyện Chợ Gạo, tỉnh Tiền Giang, Việt Nam</li>
              <li>Điện thoại: 0815 771 771 - 0911 288 338</li>
              <li>Email: info@sauthanh.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400 font-merriweather">
          <p>&copy; 2024 Mẹ Sin. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}