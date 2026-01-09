import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export function CartSummary() {
  const { subtotal, tax, shipping, total, itemCount } = useCart();

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild className="w-full" size="lg">
          <Link href={ROUTES.CHECKOUT}>Proceed to Checkout</Link>
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Shipping & taxes calculated at checkout
      </p>
    </div>
  );
}

export default CartSummary;
