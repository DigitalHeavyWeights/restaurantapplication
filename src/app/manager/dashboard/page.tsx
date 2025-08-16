'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  ChefHat,
  Package,
  BarChart3,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '@/app/lib/api';

interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
  lowStockItems: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    todayOrders: 0,
    activeCustomers: 0,
    averageOrderValue: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());



  const quickActions = [
    {
      icon: Plus,
      label: 'Add Menu Item',
      description: 'Create new menu item',
      action: () => router.push('/manager/menu/new'),
      color: 'bg-blue-500'
    },
    {
      icon: Package,
      label: 'Check Inventory',
      description: 'View stock levels',
      action: () => router.push('/manager/inventory'),
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      label: 'View Reports',
      description: 'Sales & analytics',
      action: () => router.push('/manager/reports'),
      color: 'bg-purple-500'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Restaurant settings',
      action: () => router.push('/manager/settings'),
      color: 'bg-gray-500'
    }
  ];

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Manager Dashboard" 
        />
        
        <div className="p-4 space-y-6">
          {/* Revenue & Orders Overview */}
          <div className="grid grid-cols-2 gap-3">
           

            {/* Kitchen Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5 text-neutral-600" />
                  <span className="font-medium">Kitchen Status</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/employee/kitchen')}
                >
                  View Queue
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {stats.pendingOrders}
                  </div>
                  <div className="text-xs text-neutral-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {stats.preparingOrders}
                  </div>
                  <div className="text-xs text-neutral-600">Preparing</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {stats.readyOrders}
                  </div>
                  <div className="text-xs text-neutral-600">Ready</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-20 flex-col space-y-1 border border-neutral-200 hover:border-neutral-300"
                    onClick={action.action}
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                    <span className="text-xs text-neutral-500">{action.description}</span>
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Last Updated */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-neutral-500">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}