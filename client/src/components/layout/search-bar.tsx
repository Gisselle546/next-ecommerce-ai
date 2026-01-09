"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

// Mock search results - replace with actual search API
const mockResults = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    category: "Men's Clothing",
    href: "/products/1",
  },
  { id: 2, name: "Running Shoes", category: "Shoes", href: "/products/2" },
  {
    id: 3,
    name: "Denim Jacket",
    category: "Women's Clothing",
    href: "/products/3",
  },
];

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockResults>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle search
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      // Mock search - replace with actual API call
      const filtered = mockResults.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative text-gray-700 hover:text-primary-600 transition-all duration-300"
        aria-label="Search"
      >
        <Search className="h-5 w-5 transition-transform group-hover:scale-110" />

        {/* Hover effect ring */}
        <span className="absolute inset-0 -m-2 rounded-full bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-0 group-hover:scale-100" />
      </button>

      {/* Search Modal/Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={handleClose}
          />

          {/* Search Container */}
          <div className="fixed md:absolute top-16 md:top-full left-0 md:left-auto md:right-0 w-full md:w-105 md:pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white md:rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="p-6 pb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-10 py-3.5 text-body-sm bg-gray-50 rounded-xl focus:outline-none focus:bg-gray-100 transition-all placeholder:text-gray-400"
                  />
                  {query && (
                    <button
                      onClick={() => handleSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-100 overflow-y-auto">
                {query.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-body-sm text-gray-500">
                      Start typing to search products
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={handleClose}
                        className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                          <Search className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                            {result.name}
                          </p>
                          <p className="text-label-sm text-gray-500">
                            {result.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-body-sm text-gray-500">
                      No results found for "{query}"
                    </p>
                    <p className="text-label-sm text-gray-400 mt-2">
                      Try different keywords
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              {query.length === 0 && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-label-sm font-semibold text-gray-700 mb-3">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["T-Shirts", "Sneakers", "Jackets", "Dresses"].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-4 py-2 text-label-sm bg-white rounded-full hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm hover:shadow"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
