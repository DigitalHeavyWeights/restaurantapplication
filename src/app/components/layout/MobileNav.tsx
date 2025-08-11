'use client'
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Menu, ShoppingCart, User, ChefHat, BarChart3, LucideIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Badge } from '../../components/ui/Badge';

// Define the navigation item type
interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
}

export const MobileNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  const getNavigationItems = (): NavigationItem[] => {
    if (!user) {
      return [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Menu, label: 'Menu', path: '/menu' },
        { icon: User, label: 'Login', path: '/auth/login' }
      ];
    }

    const baseItems: NavigationItem[] = [
      { icon: Home, label: 'Home', path: '/' },
      { icon: Menu, label: 'Menu', path: '/menu' }
    ];

    if (user.roles.includes('Customer')) {
      return [
        ...baseItems,
        {
          icon: ShoppingCart,
          label: 'Cart',
          path: '/order/cart',
          badge: cartItemCount > 0 ? cartItemCount : undefined
        },
        { icon: User, label: 'Profile', path: '/customer/dashboard' }
      ];
    }

    if (user.roles.includes('Employee') || user.roles.includes('Manager')) {
      return [
        ...baseItems,
        { icon: ChefHat, label: 'Kitchen', path: '/employee/kitchen' },
        { icon: BarChart3, label: 'Orders', path: '/employee/orders' },
        { icon: User, label: 'Dashboard', path: '/employee/dashboard' }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
         
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                active
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-1" />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="danger" size="sm" className="min-w-[20px] h-5 text-xs">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};