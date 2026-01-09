import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { Badge } from '@/components/ui';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link
      href={ROUTES.PRODUCT(product.slug)}
      className="group block"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="error">-{discountPercentage}%</Badge>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="warning">Low stock</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="default">Out of stock</Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm text-yellow-500">★</span>
            <span className="text-sm text-gray-600">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
