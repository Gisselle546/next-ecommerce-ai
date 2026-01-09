import type { Metadata } from "next";
import { Container } from "@/components/ui";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: categoryName,
    description: `Shop ${categoryName} products at ECOMREST`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Container className="py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <a href="/categories" className="hover:text-gray-900">
              Categories
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-900">{categoryName}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
        <p className="mt-2 text-gray-600">
          Browse our {categoryName.toLowerCase()} collection
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="group">
            <div className="aspect-square rounded-xl bg-gray-100" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-2/3 rounded bg-gray-100" />
              <div className="h-4 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
