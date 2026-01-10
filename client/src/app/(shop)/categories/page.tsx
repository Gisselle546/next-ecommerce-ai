"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { useProducts, useCategories } from "@/hooks/use-products";

export default function CategoriesPage() {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { data: products } = useProducts();

  // Calculate product count per category
  const getCategoryProductCount = (categoryId: string) => {
    if (!products?.data) return 0;
    return products.data.filter((p) => p.category?.id === categoryId).length;
  };

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Browse products by category</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories
          ?.filter((category) => getCategoryProductCount(category.id) > 0)
          .map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl border bg-white transition-all hover:border-gray-300 hover:shadow-lg"
              style={{ borderColor: "var(--color-primary-600)" }}
            >
              {/* Category image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {category.description}
                </p>
                <p className="mt-3 text-sm font-medium text-gray-500">
                  {getCategoryProductCount(category.id)} products
                </p>
              </div>
            </Link>
          ))}
      </div>
    </Container>
  );
}
