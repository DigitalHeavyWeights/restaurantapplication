import React from 'react';
import { Clock, User, MapPin, ChefHat } from 'lucide-react';
import { KitchenOrder } from '../../types/order';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Define the order status type
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface KitchenTicketProps {
  order: KitchenOrder;
  onStatusUpdate: (orderId: number, status: OrderStatus) => Promise<void>;
}

export const KitchenTicket: React.FC<KitchenTicketProps> = ({ order, onStatusUpdate }) => {
  // Early return if order is not valid
  if (!order || !order.orderStatus || !order.orderId) {
    console.warn('KitchenTicket received invalid order:', order);
    return null;
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'preparing': return 'warning';
      case 'ready': return 'success';
      case 'completed': return 'neutral';
      default: return 'primary';
    }
  };

  const getStatusActions = (status: string) => {
    switch (status.toLowerCase()) {
      case 'preparing':
        return [
          { label: 'Mark Ready', action: () => handleStatusUpdate('ready'), variant: 'primary' as const }
        ];
      case 'ready':
        return [
          { label: 'Complete', action: () => handleStatusUpdate('completed'), variant: 'primary' as const }
        ];
      default:
        return [];
    }
  };
  
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await onStatusUpdate(order.orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const getElapsedTime = (orderTime: string) => {
    if (!orderTime) return 'N/A';
    try {
      const orderDate = new Date(`2000-01-01T${orderTime}`);
      const now = new Date();
      const currentTime = new Date(`2000-01-01T${now.toTimeString().split(' ')[0]}`);
      const diffMs = currentTime.getTime() - orderDate.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins > 0 ? `${diffMins}m ago` : 'Just now';
    } catch (error) {
      console.error('Error calculating elapsed time:', error);
      return 'N/A';
    }
  };

  const actions = getStatusActions(order.orderStatus);

  return (
    <Card 
      className="mb-3 border-l-4 border-l-primary-500" 
      padding="none"
      shadow="md"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-4 h-4 text-primary-500" />
              <span className="font-bold text-lg text-neutral-900">
                #{order.orderId}
              </span>
            </div>
            <Badge variant={getStatusColor(order.orderStatus)} size="sm">
              {order.orderStatus.toUpperCase()}
            </Badge>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-sm text-neutral-600">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(order.orderTime)}
            </div>
            <div className="text-xs text-neutral-500">
              {getElapsedTime(order.orderTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-neutral-500" />
            <span className="font-medium text-neutral-900">
              {order.customerName || 'Walk-in'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <Badge variant="secondary" size="sm">
              {(order.orderType || 'unknown').toUpperCase()}
            </Badge>
          </div>
        </div>
        
        {order.estimatedPrepTime > 0 && (
          <div className="flex items-center text-sm text-neutral-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Est. prep time: {order.estimatedPrepTime} min</span>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="px-4 py-3">
        <div className="space-y-3">
          {(order.orderItems || []).map((item, index) => (
            <div key={index} className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-primary-100 text-primary-800 text-sm font-bold px-2 py-1 rounded-lg min-w-[24px] text-center">
                    {item.quantity || 0}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {item.menuItemName || 'Unknown Item'}
                  </span>
                </div>
                
                {item.specialInstructions && (
                  <div className="mt-2 ml-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-600 text-xs font-medium uppercase tracking-wide">
                          Special Instructions
                        </div>
                      </div>
                      <p className="text-sm text-yellow-800 mt-1">
                        {item.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200">
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                onClick={action.action}
                fullWidth
                className="font-medium"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};