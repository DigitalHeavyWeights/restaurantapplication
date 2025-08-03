'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { OrderSummary } from '../../../components/order/OrderSummary';
import { OrderStatusBadge } from '../../../components/order/OrderStatusBadge';
import { Loading } from '../../../components/ui/Loading';
import { CheckCircle, Clock } from 'lucide-react';
import { Order } from '../../../types/order';
import { apiClient } from '../../../lib/api';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <Loading fullScreen text="Loading order..." />;
  }

  if (!order) {
    return (
      <div className="pb-20">
        <Header title="Order Not Found" showBack />
        <div className="p-4 text-center py-12">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Order Not Found</h3>
          <p className="text-neutral-600 mb-6">We couldn't find this order</p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title="Order Confirmation" showBack={false} />
      
      <div className="p-4 space-y-6">
        {/* Success Message */}
        <Card className="text-center bg-green-50 border-green-200">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-900 mb-2">Order Placed!</h2>
          <p className="text-green-700 mb-4">
            Your order #{order.orderId} has been received and is being prepared.
          </p>
          <OrderStatusBadge status={order.orderStatus} size="lg" />
        </Card>

        {/* Estimated Time */}
        <Card className="text-center">
          <Clock className="w-12 h-12 text-primary-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">Estimated Time</h3>
          <p className="text-neutral-600 mb-2">Your order will be ready in</p>
          <p className="text-2xl font-bold text-primary-600">15-20 minutes</p>
        </Card>

        {/* Order Details */}
        <OrderSummary order={order} />

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push(`/customer/orders/${order.orderId}`)}
          >
            Track Order
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => router.push('/menu')}
          >
            Order More Items
          </Button>
        </div>
      </div>
    </div>
  );
}