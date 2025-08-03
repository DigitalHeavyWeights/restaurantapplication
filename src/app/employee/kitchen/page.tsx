'use client';
import React from 'react';
import { Header } from '../../components/layout/Header';
import { TicketQueue } from '../../components/kitchen/TicketQueue';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

export default function KitchenPage() {
  return (
    <ProtectedRoute requiredRoles={['Employee', 'Manager']}>
      <div className="pb-20">
        <Header title="Kitchen Queue" showNotifications />
        
        <div className="p-4">
          <TicketQueue autoRefresh refreshInterval={15000} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

