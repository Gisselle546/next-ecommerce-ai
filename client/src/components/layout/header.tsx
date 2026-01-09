"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { useAuthStore, useCartStore } from "@/stores";
import { ROUTES, NAVIGATION } from "@/lib/constants";
import { Container } from "@/components/ui";
import { MegaMenu } from "./mega-menu";
import { SearchBar } from "./search-bar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();
  const itemCount = useCartStore((state) => state.itemCount());
  const openCart = useCartStore((state) => state.openCart);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center">
            <span className="text-heading-lg text-primary-600">ShopHaven</span>
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAVIGATION.main.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={`text-button-md transition-colors py-6 block ${
                    "highlight" in item && item.highlight
                      ? "text-error-600 hover:text-error-700"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </Link>

                {/* Mega Menu Dropdown */}
                {hoveredItem === item.name &&
                  "categories" in item &&
                  item.categories && <MegaMenu item={item} />}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <SearchBar />

            {/* Account */}
            {isAuthenticated ? (
              <Link
                href={ROUTES.ACCOUNT}
                className="text-button-md hidden text-gray-700 transition-colors hover:text-primary-600 md:flex md:items-center md:gap-2"
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </Link>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="text-button-md hidden text-gray-700 transition-colors hover:text-primary-600 md:block"
              >
                Sign In
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="text-label-sm absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="text-gray-700 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {NAVIGATION.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-button-md transition-colors ${
                    "highlight" in item && item.highlight
                      ? "text-error-600 hover:text-error-700"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <Link
                    href={ROUTES.ACCOUNT}
                    className="text-button-md flex items-center gap-2 text-gray-700 transition-colors hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </Link>
                ) : (
                  <Link
                    href={ROUTES.LOGIN}
                    className="text-button-md text-gray-700 transition-colors hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}

export default Header;
