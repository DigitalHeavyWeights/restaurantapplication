'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { ShoppingCart, Heart, Clock, TrendingUp } from 'lucide-react';
import { CustomerStats } from '../../types/customer';
import { apiClient } from '../../lib/api';

export default function CustomerDashboard() {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const customerStats = await apiClient.getCustomerStats();
      setStats(customerStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="pb-20">
        <Header title="My Dashboard" showNotifications />
        
        <div className="p-4 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center" padding="md">
              <div className="flex items-center justify-center mb-2">
                <ShoppingCart className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-sm text-neutral-600">Total Orders</p>
              <p className="text-xl font-bold text-neutral-900">
                {stats?.totalOrders || 0}
              </p>
            </Card>
            
            <Card className="text-center" padding="md">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-neutral-600">Total Spent</p>
              <p className="text-xl font-bold text-neutral-900">
                ${stats?.totalSpent.toFixed(2) || '0.00'}
              </p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" className="h-16 flex-col">
                <ShoppingCart className="w-5 h-5 mb-1" />
                <span>Order Now</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Heart className="w-5 h-5 mb-1" />
                <span>Favorites</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Clock className="w-5 h-5 mb-1" />
                <span>Order History</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <TrendingUp className="w-5 h-5 mb-1" />
                <span>Profile</span>
              </Button>
            </div>
          </Card>

          {/* Favorite Items */}
          {stats?.favoriteItems && stats.favoriteItems.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Favorites</h3>
              <div className="space-y-3">
                {stats.favoriteItems.slice(0, 3).map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        🍽️
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{item.menuItemName}</p>
                        <p className="text-sm text-neutral-600">
                          Ordered {item.timesOrdered} times
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Order Again
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

