import Link from "next/link";
import { Container } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

const footerLinks = {
  shop: [
    { name: "All Products", href: ROUTES.PRODUCTS },
    { name: "Categories", href: ROUTES.CATEGORIES },
    { name: "New Arrivals", href: `${ROUTES.PRODUCTS}?sort=newest` },
    { name: "Sale", href: `${ROUTES.PRODUCTS}?sale=true` },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ],
  company: [{ name: "About Us", href: "/about" }],
};

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--color-primary-600)" }}
    >
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href={ROUTES.HOME} className="inline-block">
                <span className="text-xl font-bold text-primary-600">
                  ShopHaven
                </span>
              </Link>
              <p className="mt-4 text-sm text-primary-600">
                Your one-stop shop for quality products at great prices.
              </p>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="border-t py-6"
          style={{ borderColor: "var(--color-primary-600)" }}
        >
          <p className="text-center text-sm text-primary-600">
            &copy; {new Date().getFullYear()} ShopHaven. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
