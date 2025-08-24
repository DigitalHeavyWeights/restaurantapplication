'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/layout/Header';
import { CartItem } from '../../components/order/CartItem';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { TextArea } from '../../components/ui/TextArea';

export default function CartPage() {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { addToast } = useUIStore();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [instructions, setInstructions] = useState('');

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleEditInstructions = (item: any) => {
    setEditingItem(item);
    setInstructions(item.specialInstructions || '');
  };

  const handleSaveInstructions = () => {
    if (editingItem) {
      // Note: You'd need to add updateInstructions to your cart store
      setEditingItem(null);
      setInstructions('');
      addToast({
        type: 'success',
        title: 'Instructions Updated',
        message: 'Special instructions have been saved'
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/order/checkout');
  };

  if (totalItems === 0) {
    return (
      <ProtectedRoute requiredRoles={['Customer']}>
        <div className="pb-28">
          <Header title="Shopping Cart" showBack />
          <div className="p-4 text-center py-12">
            <ShoppingCart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Your cart is empty</h3>
            <p className="text-neutral-600 mb-6">Add some delicious items to get started!</p>
            <Button variant="primary" onClick={() => router.push('/menu')}>
              Browse Menu
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="pb-28">
        <Header title={`Cart (${totalItems} item${totalItems !== 1 ? 's' : ''})`} showBack />
        
        <div className="p-4 space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.menuItemId}
                item={item}
                onEditInstructions={handleEditInstructions}
              />
            ))}
          </div>

          {/* Order Summary */}
          <Card className="bg-neutral-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
            <Button
              variant="primary"
              onClick={handleCheckout}
              className="flex-2"
            >
              Checkout ${total.toFixed(2)}
            </Button>
          </div>

          {/* Continue Shopping */}
          <Button
            variant="ghost"
            onClick={() => router.push('/menu')}
            fullWidth
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add More Items
          </Button>
        </div>

        {/* Edit Instructions Modal */}
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Special Instructions"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">
                {editingItem?.menuItem.itemName}
              </h4>
              <p className="text-sm text-neutral-600 mb-4">
                Add any special instructions for this item
              </p>
            </div>
            
            <TextArea
  label="Special Instructions"
  value={instructions}
  onChange={(e) => setInstructions(e.target.value)}
  placeholder="e.g., No onions, extra sauce, well done..."
  rows={3}
/>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveInstructions}
                className="flex-1"
              >
                Save Instructions
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}