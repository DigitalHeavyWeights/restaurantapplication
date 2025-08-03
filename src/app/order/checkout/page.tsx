'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { StripePayment } from '../../components/payment/StripePayment';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { MapPin, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { addToast } = useUIStore();
  const { user } = useAuthStore();
  const [orderType, setOrderType] = useState('dine-in');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const orderTypes = [
    { value: 'dine-in', label: 'Dine In', icon: '🍽️', description: 'Eat at restaurant' },
    { value: 'takeout', label: 'Takeout', icon: '🥡', description: 'Pick up yourself' },
    { value: 'delivery', label: 'Delivery', icon: '🚚', description: 'Delivered by UberEats' }
  ];

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    // Validate delivery address if delivery selected
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      addToast({
        type: 'error',
        title: 'Delivery Address Required',
        message: 'Please enter a delivery address'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        orderType,
        orderItems: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        }))
      };

      const order = await createOrder(orderData);
      setPendingOrderId(order.orderId);
      setShowPayment(true);
      
      addToast({
        type: 'success',
        title: 'Order Created!',
        message: `Order #${order.orderId} created. Please complete payment.`
      });
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: 'Unable to place order. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    addToast({
      type: 'success',
      title: 'Payment Successful!',
      message: 'Your order has been confirmed!'
    });
    
    // If delivery order, go to delivery setup, otherwise confirmation
    if (orderType === 'delivery') {
      router.push(`/order/delivery-setup/${pendingOrderId}?address=${encodeURIComponent(deliveryAddress)}&instructions=${encodeURIComponent(deliveryInstructions)}`);
    } else {
      router.push(`/order/confirmation/${pendingOrderId}`);
    }
  };

  const handlePaymentError = (error: string) => {
    addToast({
      type: 'error',
      title: 'Payment Failed',
      message: error
    });
  };

  if (items.length === 0) {
    return (
      <div className="pb-20">
        <Header title="Checkout" showBack />
        <div className="p-4 text-center py-12">
          <div className="text-4xl mb-3">🛒</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Cart is Empty</h3>
          <p className="text-neutral-600 mb-6">Add some items to continue with checkout</p>
          <Button variant="primary" onClick={() => router.push('/menu')}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="pb-20">
        <Header title="Checkout" showBack />
        
        <div className="p-4 space-y-6">
          {!showPayment ? (
            <>
              {/* Order Type Selection */}
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Type</h3>
                <div className="space-y-3">
                  {orderTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setOrderType(type.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                        orderType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{type.icon}</div>
                        <div className="text-left">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-neutral-600">{type.description}</div>
                        </div>
                      </div>
                      {type.value === 'delivery' && (
                        <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          <Truck className="w-3 h-3" />
                          <span>UberEats</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Delivery Address (only shown for delivery) */}
              {orderType === 'delivery' && (
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Delivery Address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter complete delivery address"
                      icon={<MapPin className="w-4 h-4" />}
                      required
                    />
                    
                    <Input
                      label="Delivery Instructions (Optional)"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Building number, apartment, gate code, etc."
                    />

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Delivery by UberEats</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Delivery fee will be calculated after payment. Estimated 15-30 minutes.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Order Summary */}
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="neutral" size="sm">{item.quantity}x</Badge>
                        <div>
                          <p className="font-medium text-neutral-900">{item.menuItem.itemName}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-neutral-600">{item.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-medium">${item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>Delivery Fee</span>
                      <span>Calculated after payment</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t border-neutral-200 pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}{orderType === 'delivery' ? '+' : ''}</span>
                  </div>
                </div>
              </Card>

              {/* Place Order Button */}
              <Button
                variant="primary"
                fullWidth
                onClick={handlePlaceOrder}
                isLoading={isProcessing}
                disabled={orderType === 'delivery' && !deliveryAddress.trim()}
                className="h-14 text-lg"
              >
                Continue to Payment ${total.toFixed(2)}
              </Button>
            </>
          ) : (
            /* Payment Section */
            <>
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Order #{pendingOrderId} - Payment Required
                </h3>
                <div className="bg-neutral-50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Total Amount:</span>
                    <span className="text-xl font-bold text-primary-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="mt-2 pt-2 border-t border-neutral-200">
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Truck className="w-4 h-4" />
                        <span>Delivery fee will be added after payment</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {pendingOrderId && (
                <StripePayment
                  orderId={pendingOrderId}
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowPayment(false)}
              >
                Back to Order Review
              </Button>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}