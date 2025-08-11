'use client';
import React from 'react';
import { Header } from '../../components/layout/Header';
import { TicketQueue } from '../../components/kitchen/TicketQueue';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useOrderStore } from '../../store/orderStore'; // Add this import

export default function KitchenPage() {
  const { kitchenQueue, updateOrderStatus } = useOrderStore(); // Add this line

  return (
    <ProtectedRoute requiredRoles={['Employee', 'Manager']}>
      <div className="pb-20">
        <Header title="Kitchen Queue" showNotifications />
       
        <div className="p-4">
          <TicketQueue 
            order={kitchenQueue[0]}
            onStatusUpdate={updateOrderStatus}
            autoRefresh={true}
            refreshInterval={15000}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}