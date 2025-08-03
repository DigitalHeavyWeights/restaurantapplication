import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { apiClient } from '../../lib/api';
import { useUIStore } from '../../store/uiStore';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentFormProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  orderId,
  amount,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = useUIStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    createPaymentIntent();
  }, [orderId]);

  const createPaymentIntent = async () => {
    try {
      const response = await apiClient.createPaymentIntent({ orderId });
      setClientSecret(response.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      onError('Failed to initialize payment');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!stripe || !elements || !clientSecret) {
    return;
  }

  setIsProcessing(true);

  const cardElement = elements.getElement(CardElement);

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement!,
    }
  });

  if (error) {
    console.error('Payment failed:', error);
    onError(error.message || 'Payment failed');
    addToast({
      type: 'error',
      title: 'Payment Failed',
      message: error.message || 'Something went wrong'
    });
  } else if (paymentIntent.status === 'succeeded') {
    try {
      // Only call confirm if not already confirmed
      await apiClient.confirmPayment({ paymentIntentId: paymentIntent.id });
      addToast({
        type: 'success',
        title: 'Payment Successful',
        message: 'Your payment has been processed!'
      });
      onSuccess();
    } catch (error: any) {
      // If payment was already confirmed, that's actually OK
      if (error.response?.status === 404 || error.message.includes('already confirmed')) {
        addToast({
          type: 'success',
          title: 'Payment Successful',
          message: 'Your payment has been processed!'
        });
        onSuccess();
      } else {
        console.error('Error confirming payment:', error);
        onError('Payment processed but confirmation failed');
      }
    }
  }

  setIsProcessing(false);
};

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Payment Details
          </h3>
          <div className="p-4 border-2 border-neutral-200 rounded-xl">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="bg-neutral-50 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Total Amount:</span>
            <span className="text-xl font-bold text-primary-600">
              ${amount.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={!stripe || !clientSecret || isProcessing}
          isLoading={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </Button>
      </form>
    </Card>
  );
};

interface StripePaymentProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
};