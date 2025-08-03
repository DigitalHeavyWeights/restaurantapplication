"use client"

import React from 'react';
import { ArrowLeft, Bell, Search, Menu as MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  actions?: React.ReactNode;
  onBack?: () => void;
  onSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSearch = false,
  showNotifications = false,
  actions,
  onBack,
  onSearch
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold text-neutral-900 truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearch}
              className="p-2"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          {showNotifications && user && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge - replace with actual notification count */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>
          )}
          
          {actions}
        </div>
      </div>
    </header>
  );
};