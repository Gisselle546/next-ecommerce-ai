import type { Metadata } from "next";
import { Package, ShoppingBag, Heart } from "lucide-react";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account",
};

const stats = [
  { name: "Total Orders", value: "12", icon: Package },
  { name: "Items in Cart", value: "3", icon: ShoppingBag },
  { name: "Wishlist Items", value: "8", icon: Heart },
];

export default function AccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
      <p className="mt-2 text-gray-600">
        Welcome back! Here&apos;s an overview of your account.
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gray-100 p-3">
                <stat.icon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <Card className="mt-4 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-001
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  Jan 5, 2026
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Delivered
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  $125.00
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-002
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  Jan 3, 2026
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    Shipped
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  $89.99
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
