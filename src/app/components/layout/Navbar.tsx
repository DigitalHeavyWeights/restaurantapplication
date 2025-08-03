'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Home, ChefHat, MapPin, Phone, User, BarChart3, Package, ShoppingCart, LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();

  const cartItems = getTotalItems();

  const getNavigationItems = () => {
    if (!user) {
      return [
        { icon: Home, label: 'HOME', path: '/' },
        { icon: ChefHat, label: 'MENU', path: '/menu' },
        { icon: MapPin, label: 'FIND US', path: '/locations' },
        { icon: Phone, label: 'CONTACT', path: '/contact' },
      ];
    }

    const baseItems = [
      { icon: Home, label: 'HOME', path: '/' },
      { icon: ChefHat, label: 'MENU', path: '/menu' },
      { icon: MapPin, label: 'FIND US', path: '/locations' },
    ];

    if (user.roles.includes('Customer')) {
      return [
        ...baseItems,
        { icon: User, label: 'ACCOUNT', path: '/customer/dashboard' },
        { icon: Phone, label: 'CONTACT', path: '/contact' },
      ];
    }

    if (user.roles.includes('Manager')) {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'DASHBOARD', path: '/manager/dashboard' },
        { icon: Package, label: 'INVENTORY', path: '/manager/inventory' },
      ];
    }

    if (user.roles.includes('Employee')) {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'KITCHEN', path: '/employee/kitchen' },
        { icon: User, label: 'ACCOUNT', path: '/employee/dashboard' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-xl border-b-4 border-secondary-500 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-4 hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                  <img src='/images/logo.png' alt="The Hungry Hyena Logo" className="w-12 h-12" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-display font-black text-neutral-900">THE HUNGRY</h1>
                <h2 className="text-xl font-bold text-secondary-600 -mt-1">HYENA</h2>
              </div>
            </button>
          </div>

          {/* Bold Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-bold tracking-wide transition-all duration-200 transform hover:scale-105 rounded-xl ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-secondary-500 to-primary-600' 
                      : 'text-neutral-700 hover:text-white hover:bg-gradient-to-r hover:from-secondary-500 hover:to-primary-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCart}
                  className="relative bg-secondary-100 hover:bg-secondary-200 p-3 rounded-xl"
                >
                  <ShoppingCart className="w-6 h-6 text-secondary-600" />
                  {cartItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary-500 text-white font-bold min-w-[24px] h-6 flex items-center justify-center animate-bounce rounded-full">
                      {cartItems}
                    </Badge>
                  )}
                </Button>

                <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          logout();
          router.push('/');
        }}
        className="bg-red-100 hover:bg-red-200 p-3 rounded-xl"
      >
        <LogOut className="w-6 h-6 text-red-600" />
      </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-black">
                    {user.firstName.charAt(0)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                  className="font-bold text-neutral-700 hover:text-secondary-600"
                >
                  SIGN IN
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/auth/register')}
                  className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  ORDER NOW
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};