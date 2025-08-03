'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { MapPin, Clock, DollarSign, Truck, CheckCircle } from 'lucide-react';
import { apiClient } from '../../../lib/api';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';

export default function DeliverySetupPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useUIStore();
  const { user } = useAuthStore();
  
  const orderId = Number(params.orderId);
  const deliveryAddress = searchParams.get('address') || '';
  const deliveryInstructions = searchParams.get('instructions') || '';

  const [quote, setQuote] = useState<any>(null);
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [isCreatingDelivery, setIsCreatingDelivery] = useState(false);
  const [deliveryCreated, setDeliveryCreated] = useState(false);

  useEffect(() => {
    if (deliveryAddress) {
      getDeliveryQuote();
    }
  }, [deliveryAddress]);

  const getDeliveryQuote = async () => {
    setIsGettingQuote(true);
    try {
      // Using fixed coordinates for demo - in production you'd geocode the address
      const quoteData = await apiClient.getDeliveryQuote({
        dropoffLatitude: 40.7589, // Example NYC coordinates
        dropoffLongitude: -73.9851,
        dropoffAddress: deliveryAddress
      });

      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to get delivery quote:', error);
      addToast({
        type: 'error',
        title: 'Quote Failed',
        message: 'Unable to get delivery quote for this address'
      });
    } finally {
      setIsGettingQuote(false);
    }
  };

  const createDelivery = async () => {
    if (!quote || !user) return;

    setIsCreatingDelivery(true);
    try {
      const deliveryInfo = await apiClient.createDelivery({
        orderId,
        deliveryAddress,
        customerName: `${user.firstName} ${user.lastName}`,
        customerPhone: '+1234567890', // You'd get this from customer profile
        deliveryInstructions: deliveryInstructions || undefined
      });

      setDeliveryCreated(true);
      addToast({
        type: 'success',
        title: 'Delivery Scheduled',
        message: 'Your delivery has been scheduled with UberEats!'
      });

      // Redirect to order tracking after 2 seconds
      setTimeout(() => {
        router.push(`/customer/orders/${orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to create delivery:', error);
      addToast({
        type: 'error',
        title: 'Delivery Failed',
        message: 'Unable to schedule delivery. Please try again.'
      });
    } finally {
      setIsCreatingDelivery(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (deliveryCreated) {
    return (
      <div className="pb-20">
        <Header title="Delivery Scheduled" showBack={false} />
        
        <div className="p-4 space-y-6">
          <Card className="text-center bg-green-50 border-green-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-900 mb-2">Delivery Scheduled!</h2>
            <p className="text-green-700 mb-4">
              Your order is being prepared and will be delivered by UberEats.
            </p>
            <Button 
              variant="primary" 
              onClick={() => router.push(`/customer/orders/${orderId}`)}
            >
              Track Your Order
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['Customer']}>
      <div className="pb-20">
        <Header title="Setup Delivery" showBack />
        
        <div className="p-4 space-y-6">
          {/* Order Info */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="w-6 h-6 text-primary-500" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Delivery Service</h3>
                <p className="text-sm text-neutral-600">Powered by UberEats</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-neutral-500 mt-1" />
                  <div>
                    <div className="text-sm text-neutral-600">Delivering to:</div>
                    <div className="font-medium text-neutral-900">{deliveryAddress}</div>
                    {deliveryInstructions && (
                      <div className="text-sm text-neutral-600 mt-1">
                        <span className="font-medium">Instructions:</span> {deliveryInstructions}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quote Display */}
          {isGettingQuote ? (
            <Card>
              <Loading text="Getting delivery quote..." />
            </Card>
          ) : quote ? (
            <Card>
              <h4 className="font-medium text-neutral-900 mb-3">Delivery Quote</h4>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-green-600">Delivery Fee</div>
                    <div className="font-semibold text-green-900">
                      ${quote.deliveryFee.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-green-600">Est. Time</div>
                    <div className="font-semibold text-green-900">
                      {formatTime(quote.estimatedDeliveryTime)}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={createDelivery}
                isLoading={isCreatingDelivery}
                className="h-12 mt-4"
              >
                Schedule Delivery (${quote.deliveryFee.toFixed(2)})
              </Button>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-6">
                <p className="text-neutral-600 mb-4">Unable to get delivery quote</p>
                <Button variant="outline" onClick={getDeliveryQuote}>
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push(`/order/confirmation/${orderId}`)}
          >
            Skip Delivery (Pickup Instead)
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}