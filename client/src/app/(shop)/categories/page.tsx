import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse products by category",
};

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Phones, laptops, accessories & more",
    itemCount: 120,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes & accessories",
    itemCount: 450,
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor & kitchen essentials",
    itemCount: 280,
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Fitness equipment & outdoor gear",
    itemCount: 95,
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, makeup & fragrances",
    itemCount: 180,
  },
  {
    name: "Books",
    slug: "books",
    description: "Fiction, non-fiction & textbooks",
    itemCount: 320,
  },
];

export default function CategoriesPage() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Browse products by category</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg"
          >
            {/* Placeholder for category image */}
            <div className="mb-4 h-32 rounded-lg bg-gray-100" />

            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600">
              {category.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{category.description}</p>
            <p className="mt-3 text-sm font-medium text-gray-500">
              {category.itemCount} products
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
