import React from 'react';
import { Clock, User, MapPin, CreditCard } from 'lucide-react';
import { Order } from '../../types/order';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface OrderSummaryProps {
  order: Order;
  showCustomerInfo?: boolean;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  showCustomerInfo = false,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'preparing': return 'primary';
      case 'ready': return 'success';
      case 'completed': return 'neutral';
      case 'cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={className} padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-neutral-900">
            Order #{order.orderId}
          </h3>
          <Badge variant={getStatusColor(order.orderStatus)} size="md">
            {order.orderStatus.toUpperCase()}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">{formatDate(order.orderDate)}</p>
          <p className="text-sm text-neutral-600">{formatTime(order.orderTime)}</p>
        </div>
      </div>

      {/* Customer & Order Info */}
      {showCustomerInfo && (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{order.customerName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{order.orderType}</span>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.orderItems.map((item) => (
          <div key={item.orderItemId} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <span className="bg-neutral-100 text-neutral-700 text-sm px-2 py-1 rounded-lg min-w-[24px] text-center">
                {item.quantity}
              </span>
              <div className="flex-1">
                <span className="text-neutral-900">{item.menuItemName}</span>
                {item.specialInstructions && (
                  <p className="text-xs text-neutral-600 mt-1">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
            </div>
            <span className="font-medium text-neutral-900">
              ${item.lineTotal.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Payment Info */}
      {order.payments.length > 0 && (
        <div className="border-t border-neutral-200 pt-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700">Payment</span>
          </div>
          {order.payments.map((payment) => (
            <div key={payment.paymentId} className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">{payment.paymentMethod}</span>
              <span className="font-medium">${payment.paymentAmount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-neutral-900">Total</span>
          <span className="text-lg font-bold text-primary-600">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};