import React, { useEffect, useState } from 'react';
import { RefreshCw, Filter, AlertCircle } from 'lucide-react';
import { KitchenOrder } from '../../types/order';
import { KitchenTicket } from './KitchenTicket';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useOrderStore } from '../../store/orderStore';
import { useUIStore } from '../../store/uiStore';

interface TicketQueueProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const TicketQueue: React.FC<TicketQueueProps> = ({
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const { kitchenQueue, isLoading, loadKitchenQueue, updateOrderStatus } = useOrderStore();
  const { addToast } = useUIStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadKitchenQueue();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadKitchenQueue();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadKitchenQueue]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadKitchenQueue();
      addToast({
        type: 'success',
        title: 'Queue Updated',
        message: 'Kitchen queue refreshed successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh kitchen queue'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? kitchenQueue 
    : kitchenQueue.filter(order => order.orderStatus.toLowerCase() === statusFilter.toLowerCase());

  const getOrderCounts = () => {
    const counts = kitchenQueue.reduce((acc, order) => {
      const status = order.orderStatus.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      preparing: counts.preparing || 0,
      ready: counts.ready || 0,
      total: kitchenQueue.length
    };
  };

  const counts = getOrderCounts();
  const statusOptions = [
    { value: 'all', label: 'All Orders', count: counts.total },
    { value: 'preparing', label: 'Preparing', count: counts.preparing },
    { value: 'ready', label: 'Ready', count: counts.ready }
  ];

  if (isLoading && kitchenQueue.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
          <p className="text-neutral-600">Loading kitchen queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Kitchen Queue</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          isLoading={isRefreshing}
          className="p-2"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-xl border border-neutral-200 text-center">
          <div className="text-2xl font-bold text-neutral-900">{counts.total}</div>
          <div className="text-sm text-neutral-600">Total Orders</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-800">{counts.preparing}</div>
          <div className="text-sm text-yellow-600">Preparing</div>
        </div>
        <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-800">{counts.ready}</div>
          <div className="text-sm text-green-600">Ready</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span>{option.label}</span>
            {option.count > 0 && (
              <Badge 
                variant={statusFilter === option.value ? 'secondary' : 'neutral'} 
                size="sm"
              >
                {option.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-neutral-900 mb-1">
            {statusFilter === 'all' ? 'No orders in queue' : `No ${statusFilter} orders`}
          </h3>
          <p className="text-neutral-600">
            {statusFilter === 'all' 
              ? 'Orders will appear here as they come in' 
              : `Switch to "All Orders" to see the complete queue`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <KitchenTicket
              key={order.orderId}
              order={order}
              onStatusUpdate={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};