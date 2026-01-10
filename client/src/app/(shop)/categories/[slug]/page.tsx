"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { useCategory, useCategoryProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/products/product-card";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = React.useState<string>("");

  React.useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const { data: category, isLoading: categoryLoading } = useCategory(slug);
  const { data: categoryProducts, isLoading: productsLoading } =
    useCategoryProducts(slug);

  console.log("Category Products Data:", categoryProducts);
  console.log("Products Array:", categoryProducts?.products?.data);

  if (!slug || categoryLoading) {
    return (
      <Container className="py-8 md:py-12">
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-48 bg-gray-100 rounded" />
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-96 bg-gray-100 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-4 w-1/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/categories" className="hover:text-gray-900">
              Categories
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{category?.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
        <p className="mt-2 text-gray-600">
          {category?.description || `Browse our ${category?.name} collection`}
        </p>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group">
              <div className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-1/3 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : categoryProducts?.products?.data &&
        categoryProducts.products.data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {categoryProducts.products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-600 mb-6">
            Sorry, there are currently no products in this category.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Other Categories
          </Link>
        </div>
      )}
    </Container>
  );
}
