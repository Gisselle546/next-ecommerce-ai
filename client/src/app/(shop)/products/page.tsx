"use client";

import React from "react";
import { Container } from "@/components/ui";
import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/products/product-card";

export default function ProductsPage() {
  // Filter and pagination state
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [minPrice, setMinPrice] = React.useState<string>("");
  const [maxPrice, setMaxPrice] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<string>("featured");

  // Fetch categories first
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Get unique categories
  const uniqueCategories = React.useMemo(() => {
    if (!categories) return [];
    console.log("Raw categories:", categories);

    // Use Map to ensure uniqueness by both id and name
    const uniqueMap = new Map();
    categories.forEach((cat) => {
      // Use name as key to catch duplicates with different IDs
      const key = cat.name.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, cat);
      }
    });

    const unique = Array.from(uniqueMap.values());
    console.log("Unique categories:", unique);
    return unique;
  }, [categories]);

  // Build filters object
  const filters = React.useMemo(() => {
    const f: any = {
      page: currentPage,
      limit: 9,
    };

    // Backend expects categoryId (UUID), not slug
    // We'll need to find the category ID from the slug
    if (selectedCategories.length > 0) {
      const selectedCategory = uniqueCategories.find(
        (cat) => cat.slug === selectedCategories[0]
      );
      if (selectedCategory) {
        f.categoryId = selectedCategory.id;
      }
    }

    if (minPrice) f.minPrice = parseFloat(minPrice);
    if (maxPrice) f.maxPrice = parseFloat(maxPrice);

    // Backend expects: sortBy (enum) and order ('ASC' | 'DESC')
    if (sortBy === "price-asc") {
      f.sortBy = "price";
      f.order = "ASC";
    } else if (sortBy === "price-desc") {
      f.sortBy = "price";
      f.order = "DESC";
    } else if (sortBy === "newest") {
      f.sortBy = "createdAt";
      f.order = "DESC";
    } else if (sortBy === "rating") {
      f.sortBy = "averageRating";
      f.order = "DESC";
    }

    console.log("Filters being sent:", f);
    return f;
  }, [
    selectedCategories,
    minPrice,
    maxPrice,
    currentPage,
    sortBy,
    uniqueCategories,
  ]);

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(filters);

  // Handle category checkbox toggle
  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = products?.meta?.totalPages || 1;

  return (
    <Container className="py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="mt-2 text-gray-600">Discover our complete collection</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Filters Sidebar */}
        <aside className="mb-6 lg:mb-0 lg:w-64 lg:shrink-0">
          <div className="rounded-xl shadow-md bg-white p-6">
            <h2 className="font-semibold text-gray-900">Filters</h2>

            {/* Categories */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              {categoriesLoading ? (
                <div className="mt-3 space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-5 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <ul className="mt-3 space-y-2">
                  {uniqueCategories?.map((cat) => (
                    <li key={cat.id}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.slug)}
                          onChange={() => handleCategoryToggle(cat.slug)}
                          className="h-4 w-4 rounded shadow-md text-black focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {cat.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border px-3 py-2 text-sm  text-gray-900"
                  style={{ borderColor: "var(--color-primary-600)" }}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border px-3 py-2 text-sm  text-gray-900"
                  style={{ borderColor: "var(--color-primary-600)" }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort & Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{products?.meta?.total || 0}</span>{" "}
              products
            </p>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border shadow-sm px-3 py-2 text-sm text-gray-900"
              style={{ borderColor: "var(--color-primary-600)" }}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Best Rating</option>
            </select>
          </div>

          {/* Product Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="group">
                  <div className="aspect-square rounded-xl bg-gray-100 shadow-md animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-1/3 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : products?.data && products.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-500">
                Error loading products: {String(productsError)}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {products?.data && products.data.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-black text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
