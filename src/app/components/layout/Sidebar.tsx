"use client"

import React from 'react';
import { X, User, Settings, LogOut, Home, Menu, ShoppingCart, ChefHat, BarChart3, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  if (!user || !isSidebarOpen) return null;

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/' },
      { icon: Menu, label: 'Menu', path: '/menu' }
    ];

    if (user.roles.includes('Customer')) {
      return [
        ...baseItems,
        { icon: User, label: 'Profile', path: '/customer/profile' },
        { icon: ShoppingCart, label: 'Orders', path: '/customer/orders' },
        { icon: Settings, label: 'Settings', path: '/customer/settings' }
      ];
    }

    if (user.roles.includes('Manager')) {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Dashboard', path: '/manager/dashboard' },
        { icon: ChefHat, label: 'Kitchen', path: '/employee/kitchen' },
        { icon: Menu, label: 'Menu Management', path: '/manager/dashboard/menu' },
        { icon: Package, label: 'Inventory', path: '/manager/inventory' },
        { icon: Settings, label: 'Settings', path: '/manager/settings' }
      ];
    }

    if (user.roles.includes('Employee')) {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Dashboard', path: '/employee/dashboard' },
        { icon: ChefHat, label: 'Kitchen', path: '/employee/kitchen' },
        { icon: Settings, label: 'Settings', path: '/employee/settings' }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path: string) => {
    router.push(path);
    toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    toggleSidebar();
    router.push('/');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleSidebar}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-neutral-600">
              {user.roles.join(', ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-neutral-100 transition-colors"
              >
                <IconComponent className="w-5 h-5 text-neutral-600" />
                <span className="text-neutral-900">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};