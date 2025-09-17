import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeInImage } from "@/components/fade-in-image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { fetchProductsWithImages, Product, ProductImage, ProductWithImage  } from "@/lib/getProducts";


export default async function SanPhamPage() {
  let products: ProductWithImage[] = [];
  let heroImage: string = '/placeholder.svg?height=600&width=1200';
  let heroImageMain: string = '/placeholder.svg?height=400&width=400';

  try {
    const data = await fetchProductsWithImages();
    products = data.products;
    heroImage = data.heroImage;
    heroImageMain = data.heroImageMain;
  } catch (error) {
    return <div>Lỗi khi tải sản phẩm. Vui lòng thử lại sau.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section with Main Product */}
      <section className="relative h-[600px] bg-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          <FadeInImage
            src={heroImage}
            alt="Hero Background"
            className="object-cover"
            fill={true}
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 py-24 pt-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
                Sản phẩm
                <br />
                <span className="text-amber-300">Mẹ Sin</span>
              </h1>
              <p className="text-lg mb-8 opacity-90 font-merriweather">
                Khám phá bộ sưu tập đầy đủ các sản phẩm bánh tráng, bún, phở, hủ tiếu chất lượng cao từ Mẹ Sin
              </p>
            </div>
            <div className="relative -mt-20">
              <FadeInImage
              src={"/icon.jpg"}
              alt="Sản phẩm Mẹ Sin"
              width={400}
              height={400}
              className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:grid-flow-col-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat" style={{ color: product.color }}>
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-6 font-merriweather leading-relaxed">
                    {product.description || product.short_description || 'Không có mô tả.'}
                  </p>
                  <Link href={`/san-pham/${product.slug}`}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 font-open-sans">XEM CHI TIẾT</Button>
                  </Link>
                </div>
                <div className={index % 2 === 1 ? "md:col-start-1" : ""}>
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                    <FadeInImage
                      src={product.image}
                      alt={product.alt}
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 font-merriweather">Những sản phẩm được yêu thích nhất</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products
              .filter((product) => product.featured)
              .map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <FadeInImage
                      src={product.image}
                      alt={product.alt}
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 font-montserrat">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 font-merriweather line-clamp-3">
                      {product.short_description || product.description || 'Không có mô tả.'}
                    </p>
                    <Link href={`/san-pham/${product.slug}`}>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-open-sans w-full">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Shopping Experience Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 font-montserrat">
                Trải nghiệm mua sắm
                <br />
                <span className="text-emerald-600">tuyệt vời</span>
              </h2>
              <p className="text-gray-600 mb-6 font-merriweather">
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất với dịch vụ tận tâm và chuyên
                nghiệp.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 font-open-sans">Mua ngay</Button>
            </div>
            <div className="relative">
              <FadeInImage
                src="/sin.jpg"
                alt="Shopping Experience"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer products={products} />
    </div>
  );
}