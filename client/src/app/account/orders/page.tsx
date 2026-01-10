import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history",
};

const orders = [
  {
    id: "ORD-001",
    date: "January 5, 2026",
    status: "Delivered",
    statusColor: "success" as const,
    total: "$125.00",
    items: 3,
  },
  {
    id: "ORD-002",
    date: "January 3, 2026",
    status: "Shipped",
    statusColor: "info" as const,
    total: "$89.99",
    items: 2,
  },
  {
    id: "ORD-003",
    date: "December 28, 2025",
    status: "Processing",
    statusColor: "warning" as const,
    total: "$245.50",
    items: 5,
  },
];

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <p className="mt-2 text-gray-600">View and track your orders</p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={ROUTES.ORDER(order.id)}>
            <Card className="p-6 hover:border-gray-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">#{order.id}</p>
                  <p className="mt-1 text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{order.items} items</p>
                    <p className="font-semibold text-gray-900">{order.total}</p>
                  </div>
                  <Badge variant={order.statusColor}>{order.status}</Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href={ROUTES.PRODUCTS}
            className="mt-4 inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Start shopping
          </Link>
        </Card>
      )}
    </div>
  );
}
