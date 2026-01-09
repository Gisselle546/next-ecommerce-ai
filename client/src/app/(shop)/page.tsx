import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { HeroCarousel } from "@/components/home/hero-carousel";

export default function HomePage() {
  return (
    <>
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-600">
                Check out our most popular items
              </p>
            </div>
            <Link
              href={ROUTES.PRODUCTS}
              className="hidden sm:flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Placeholder for ProductGrid - will be populated when API is connected */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group">
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-4 w-1/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link href={ROUTES.PRODUCTS}>View all products</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-gray-600">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {["Electronics", "Fashion", "Home & Living", "Sports"].map(
              (category) => (
                <Link
                  key={category}
                  href={`/categories/${category
                    .toLowerCase()
                    .replace(/ & /g, "-")}`}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200"
                >
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white">
                      {category}
                    </h3>
                  </div>
                </Link>
              )
            )}
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="rounded-2xl bg-gray-900 px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Subscribe to our newsletter
            </h2>
            <p className="mt-4 text-gray-300">
              Get the latest updates on new products and upcoming sales.
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 rounded-lg border-0 bg-white px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white sm:w-80"
              />
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
