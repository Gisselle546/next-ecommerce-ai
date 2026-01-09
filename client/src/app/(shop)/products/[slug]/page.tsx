import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch product data for metadata
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Shop ${slug} at ECOMREST`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // TODO: Fetch product data
  // const product = await productsApi.getBySlug(slug);
  // if (!product) notFound();

  return (
    <Container className="py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {/* ProductGallery component will go here */}
          </div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <a href="/products" className="hover:text-gray-900">
                  Products
                </a>
              </li>
              <li>/</li>
              <li className="text-gray-900">Product Name</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900">
            {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">(42 reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <span className="text-3xl font-bold text-gray-900">$99.99</span>
            <span className="ml-2 text-lg text-gray-500 line-through">
              $129.99
            </span>
            <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800">
              -23%
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-600">
            This is a placeholder description for the product. Replace this with
            actual product data when the API is connected.
          </p>

          {/* Variants (placeholder) */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-3 flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-black"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart (placeholder) */}
          <div className="mt-8">
            <button className="w-full rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800">
              Add to Cart
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• High-quality materials</li>
              <li>• Made with care</li>
              <li>• 30-day return policy</li>
              <li>• Free shipping on orders over $50</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group">
              <div className="aspect-square rounded-xl bg-gray-100" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="h-4 w-1/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
