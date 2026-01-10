"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { useFeaturedProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/products/product-card";

export default function HomePage() {
  const { data: featuredProducts, isLoading: productsLoading } =
    useFeaturedProducts(8);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Get 6 random main categories (not necessarily the first 6)
  const mainCategories = React.useMemo(() => {
    const rootCategories = categories?.filter((cat) => !cat.parent) || [];
    // Shuffle and take 6
    return [...rootCategories].sort(() => Math.random() - 0.5).slice(0, 6);
  }, [categories]);

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

          {/* Product Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="group">
                  <div className="aspect-square rounded-xl bg-gray-100 shadow-md animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-1/3 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}

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

          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : mainCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {mainCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200 hover:shadow-xl transition-shadow"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-200 mt-1">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
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
