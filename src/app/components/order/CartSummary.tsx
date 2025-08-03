'use client'

import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { CartItem } from './CartItem';
import { Button } from '../../components/ui/Button';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { useCartStore } from '../../store/cartStore';
import { useRouter } from 'next/navigation';

export const CartSummary: React.FC = () => {
  const router = useRouter();
  const { items, isOpen, toggleCart, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const [editingItem, setEditingItem] = useState<any>(null);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    toggleCart();
    router.push('/order/checkout');
  };

  const handleEditInstructions = (item: any) => {
    setEditingItem(item);
  };

  if (totalItems === 0) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={toggleCart}
        title="Your Cart"
      >
        <div className="p-6 text-center">
          <ShoppingCart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Your cart is empty</h3>
          <p className="text-neutral-600 mb-6">Add some delicious items to get started!</p>
          <Button variant="primary" onClick={toggleCart} fullWidth>
            Continue Shopping
          </Button>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={toggleCart}
      title={`Cart (${totalItems} item${totalItems !== 1 ? 's' : ''})`}
    >
      <div className="p-4 space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <CartItem
              key={item.menuItemId}
              item={item}
              onEditInstructions={handleEditInstructions}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-600">Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-600">Tax</span>
            <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
          </div>
          <div className="border-t border-neutral-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold text-primary-600">
                ${(totalPrice * 1.08).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={clearCart}
            className="flex-1"
          >
            Clear Cart
          </Button>
          <Button
            variant="primary"
            onClick={handleCheckout}
            className="flex-2"
          >
            Checkout
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

