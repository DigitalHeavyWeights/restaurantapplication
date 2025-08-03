import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface PaymentFormProps {
  orderTotal: number;
  onPayment: (paymentData: {
    paymentMethod: string;
    paymentAmount: number;
    transactionId?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  orderTotal,
  onPayment,
  isLoading = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentAmount, setPaymentAmount] = useState(orderTotal);
  const [transactionId, setTransactionId] = useState('');

  const paymentMethods = [
    { value: 'Cash', icon: DollarSign, label: 'Cash' },
    { value: 'Credit Card', icon: CreditCard, label: 'Credit Card' },
    { value: 'Debit Card', icon: CreditCard, label: 'Debit Card' },
    { value: 'Mobile Payment', icon: CreditCard, label: 'Mobile Payment' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await onPayment({
      paymentMethod,
      paymentAmount,
      transactionId: transactionId || undefined
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Details</h3>
        
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-colors ${
                    paymentMethod === method.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Amount */}
        <Input
          label="Payment Amount"
          type="number"
          step="0.01"
          min="0"
          max={orderTotal}
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
          required
        />

        {/* Transaction ID */}
        <Input
          label="Transaction ID (Optional)"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter transaction reference"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={paymentAmount <= 0 || paymentAmount > orderTotal}
        >
          Process Payment ${paymentAmount.toFixed(2)}
        </Button>
      </form>
    </Card>
  );
};