import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Container, Card, Badge } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id}`,
    description: `View order details for order ${id}`,
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <div>
      {/* Back Link */}
      <Link
        href={ROUTES.ORDERS}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to orders
      </Link>

      {/* Order Header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{id}</h1>
          <p className="mt-1 text-gray-600">Placed on January 5, 2026</p>
        </div>
        <Badge variant="success" size="md">
          Delivered
        </Badge>
      </div>

      {/* Order Items */}
      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 px-6 py-4">
              <div className="relative h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                <div className="flex h-full items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Product Name {item}</p>
                <p className="text-sm text-gray-500">Qty: 1</p>
              </div>
              <p className="font-medium text-gray-900">$49.99</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Order Summary & Shipping */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900">Shipping Address</h2>
          <address className="mt-4 text-sm not-italic text-gray-600">
            John Doe
            <br />
            123 Main Street
            <br />
            Apt 4B
            <br />
            New York, NY 10001
            <br />
            United States
          </address>
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900">Order Summary</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-medium text-gray-900">$149.97</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-medium text-gray-900">$5.00</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Tax</dt>
              <dd className="font-medium text-gray-900">$12.50</dd>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold text-gray-900">$167.47</dd>
              </div>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
