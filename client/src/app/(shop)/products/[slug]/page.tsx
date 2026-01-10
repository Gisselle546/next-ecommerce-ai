"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks";
import { ProductCard } from "@/components/products/product-card";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [slug, setSlug] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const { data: product, isLoading, error } = useProduct(slug);
  const { data: relatedProducts } = useRelatedProducts(product?.id || "", 4);
  const { addItem, isAdding } = useCart();

  // Set first variant as default if variants exist
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0].id);
    }
  }, [product, selectedVariant]);

  if (error) {
    notFound();
  }

  if (!slug || isLoading) {
    return (
      <Container className="py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 animate-pulse">
          <div>
            <div className="aspect-square rounded-xl bg-gray-100" />
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 w-20 rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-4 h-4 w-48 rounded bg-gray-100" />
            <div className="h-8 w-3/4 rounded bg-gray-100 mb-3" />
            <div className="h-6 w-32 rounded bg-gray-100 mb-6" />
            <div className="h-10 w-48 rounded bg-gray-100 mb-6" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-5/6 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/products" className="hover:text-gray-900">
                  Products
                </Link>
              </li>
              <li>/</li>
              {product.category && (
                <>
                  <li>
                    <Link
                      href={`/categories/${product.category.slug}`}
                      className="hover:text-gray-900"
                    >
                      {product.category.name}
                    </Link>
                  </li>
                  <li>/</li>
                </>
              )}
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(Number(product.averageRating) || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({(Number(product.averageRating) || 0).toFixed(1)} ·{" "}
              {Number(product.reviewCount) || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <span className="text-3xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice &&
              Number(product.compareAtPrice) > Number(product.price) && (
                <>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${Number(product.compareAtPrice).toFixed(2)}
                  </span>
                  <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800">
                    -
                    {Math.round(
                      ((Number(product.compareAtPrice) -
                        Number(product.price)) /
                        Number(product.compareAtPrice)) *
                        100
                    )}
                    %
                  </span>
                </>
              )}
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {Number(product.stock) > 0 ? (
              <span className="text-sm font-medium text-green-600">
                In Stock ({Number(product.stock)} available)
              </span>
            ) : (
              <span className="text-sm font-medium text-red-600">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-600">{product.description}</p>

          {/* Variants/Size Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Size:{" "}
                <span className="text-gray-600">
                  {product.variants.find((v) => v.id === selectedVariant)
                    ?.name || "Select a size"}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedVariant === variant.id
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-900 hover:border-black"
                    } ${
                      variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={variant.stock === 0}
                  >
                    {variant.name}
                    {variant.stock === 0 && (
                      <span className="ml-1 text-xs">(Out of stock)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(Number(product.stock), quantity + 1))
                  }
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  disabled={quantity >= Number(product.stock)}
                >
                  +
                </button>
              </div>
              <button
                onClick={async () => {
                  try {
                    console.log("Adding to cart:", {
                      productId: product.id,
                      variantId: selectedVariant,
                      quantity,
                    });

                    await addItem({
                      productId: product.id,
                      variantId: selectedVariant || undefined,
                      quantity,
                    });

                    console.log("Successfully added to cart");
                  } catch (error) {
                    console.error("Failed to add to cart:", error);
                  }
                }}
                disabled={
                  Number(product.stock) === 0 ||
                  isAdding ||
                  (product.variants &&
                    product.variants.length > 0 &&
                    !selectedVariant)
                }
                className="flex-1 rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAdding
                  ? "Adding..."
                  : product.variants &&
                    product.variants.length > 0 &&
                    !selectedVariant
                  ? "Select a size"
                  : Number(product.stock) > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• SKU: {product.sku}</li>
              <li>• 30-day return policy</li>
              <li>• Free shipping on orders over $50</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
