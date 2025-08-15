'use client';
import React, { useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TicketQueue } from '../../components/kitchen/TicketQueue';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useOrderStore } from '../../store/orderStore';

export default function KitchenPage() {
  const { kitchenQueue, updateOrderStatus, loadKitchenQueue, isLoading } = useOrderStore();

useEffect(() => {
  console.log('About to load kitchen queue...');
  loadKitchenQueue().catch(error => {
    console.error('Kitchen queue error:', error);
  });
}, []);

  return (
    <ProtectedRoute requiredRoles={['Employee', 'Manager']}>
      <div className="pb-20">
        <Header title="Kitchen Queue" showNotifications />
        
        <div className="p-4">
    {isLoading ? (
  <div>Loading orders...</div>
) : kitchenQueue.length > 0 ? (
  kitchenQueue.filter(order => order != null).map((order) => (  // Add filter
    <TicketQueue
      key={order.orderId}
      order={order}
      onStatusUpdate={updateOrderStatus}
      autoRefresh={true}
      refreshInterval={15000}
    />
  ))
) : (
  <div>No orders in queue</div>
)}
        </div>
      </div>
    </ProtectedRoute>
  );
}