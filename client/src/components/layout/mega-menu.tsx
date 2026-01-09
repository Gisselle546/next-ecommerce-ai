import Link from "next/link";

interface MegaMenuProps {
  item: {
    name: string;
    href: string;
    featured?: ReadonlyArray<{ name: string; href: string }>;
    categories?: ReadonlyArray<{
      title: string;
      items: ReadonlyArray<{ name: string; href: string }>;
    }>;
    highlight?: boolean;
  };
}

export function MegaMenu({ item }: MegaMenuProps) {
  if (!item.categories) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 w-[95vw] max-w-7xl">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl">
        <div className="px-16 py-12">
          <div className="grid grid-cols-4 gap-16">
            {/* Featured Section */}
            {item.featured && (
              <div>
                <h3 className="text-heading-xs text-gray-900 mb-5">Featured</h3>
                <ul className="space-y-2.5">
                  {item.featured.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-gray-600 hover:text-primary-600 transition-all duration-200 block py-1.5 hover:translate-x-1"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category Columns */}
            {item.categories.map((category) => (
              <div key={category.title}>
                <h3 className="text-heading-xs text-gray-900 mb-5">
                  {category.title}
                </h3>
                <ul className="space-y-2.5">
                  {category.items.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-gray-600 hover:text-primary-600 transition-all duration-200 block py-1.5 hover:translate-x-1"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
