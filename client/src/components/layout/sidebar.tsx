'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks';
import { ROUTES } from '@/lib/constants';

const sidebarLinks = [
  { name: 'Account', href: ROUTES.ACCOUNT, icon: User },
  { name: 'Orders', href: ROUTES.ORDERS, icon: Package },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, logoutMutation } = useAuth();

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}

        <button
          onClick={() => logout()}
          disabled={logoutMutation.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5" />
          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
