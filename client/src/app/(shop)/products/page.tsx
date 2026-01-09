import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our complete collection of products",
};

export default function ProductsPage() {
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
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">Filters</h2>

            {/* Categories */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              <ul className="mt-3 space-y-2">
                {[
                  "All",
                  "Electronics",
                  "Fashion",
                  "Home & Living",
                  "Sports",
                ].map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-600">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
              Showing <span className="font-medium">0</span> products
            </p>
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Best Rating</option>
            </select>
          </div>

          {/* Product Grid Placeholder */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="group">
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-4 w-1/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
