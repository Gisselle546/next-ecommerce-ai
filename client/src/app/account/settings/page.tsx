import type { Metadata } from "next";
import { Card, Button, Input } from "@/components/ui";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-2 text-gray-600">
        Manage your account settings and preferences
      </p>

      {/* Profile Section */}
      <Card className="mt-8 p-6">
        <h2 className="font-semibold text-gray-900">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your personal information
        </p>

        <form className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" defaultValue="John" />
            <Input label="Last name" defaultValue="Doe" />
          </div>
          <Input label="Email" type="email" defaultValue="john@example.com" />
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      {/* Password Section */}
      <Card className="mt-6 p-6">
        <h2 className="font-semibold text-gray-900">Change Password</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your password to keep your account secure
        </p>

        <form className="mt-6 space-y-4">
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" />
          <Input label="Confirm new password" type="password" />
          <Button type="submit">Update password</Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="mt-6 border-red-200 p-6">
        <h2 className="font-semibold text-red-600">Danger Zone</h2>
        <p className="mt-1 text-sm text-gray-600">
          Permanently delete your account and all associated data
        </p>
        <Button variant="danger" className="mt-4">
          Delete Account
        </Button>
      </Card>
    </div>
  );
}
