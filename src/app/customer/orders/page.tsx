'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Order } from '../../types/order';
import { apiClient } from '../../lib/api';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const response = await apiClient.getCustomerOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        pageSize: 20
      });
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading orders..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="pb-20">
        <Header title="My Orders" showNotifications />
        
        <div className="p-4 space-y-6">
          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Orders Found</h3>
              <p className="text-neutral-600 mb-6">
                {statusFilter === 'all' ? 'You haven\'t placed any orders yet' : `No ${statusFilter} orders`}
              </p>
              <Button variant="primary" onClick={() => router.push('/menu')}>
                Start Ordering
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card 
                  key={order.orderId}
                  onClick={() => router.push(`/customer/orders/${order.orderId}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  padding="md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-neutral-900">
                        Order #{order.orderId}
                      </h3>
                      <OrderStatusBadge status={order.orderStatus} size="sm" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(order.orderDate)} at {formatTime(order.orderTime)}</span>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {order.orderType}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">
                        {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

