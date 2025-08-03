'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { OrderSummary } from '../../../components/order/OrderSummary';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { OrderTimer } from '../../../components/kitchen/OrderTimer';
import { RefreshCw } from 'lucide-react';
import { Order } from '../../../types/order';
import { apiClient } from '../../../lib/api';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (params.orderId) {
      loadOrder(Number(params.orderId));
    }
  }, [params.orderId]);

  const loadOrder = async (orderId: number) => {
    try {
      const orderData = await apiClient.getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!order) return;
    
    setIsRefreshing(true);
    try {
      await loadOrder(order.orderId);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="pb-20">
        <Header title="Order Not Found" showBack />
        <div className="p-4 text-center py-12">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Order Not Found</h3>
          <p className="text-neutral-600">We couldn't find this order</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="pb-20">
        <Header 
          title={`Order #${order.orderId}`} 
          showBack
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              className="p-2"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          }
        />
        
        <div className="p-4 space-y-6">
          {/* Order Timer */}
          {(order.orderStatus === 'preparing' || order.orderStatus === 'ready') && (
            <Card className="text-center">
              <OrderTimer 
                orderTime={order.orderTime}
                estimatedPrepTime={20}
                className="justify-center text-lg"
              />
            </Card>
          )}

          {/* Order Summary */}
          <OrderSummary order={order} />

          {/* Actions */}
          {order.orderStatus === 'pending' && (
            <Button variant="outline" fullWidth>
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}