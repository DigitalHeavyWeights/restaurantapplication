import React from 'react';
import { Plus, Minus, Trash2, Edit3 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/order';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
  onEditInstructions?: (item: CartItemType) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onEditInstructions }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.menuItemId);
    } else {
      updateQuantity(item.menuItemId, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-start space-x-3">
        {/* Item Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🍽️</span>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-medium text-neutral-900 truncate">
                {item.menuItem.itemName}
              </h3>
              <p className="text-sm text-neutral-600">
                ${item.menuItem.price.toFixed(2)} each
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-neutral-900">
                ${item.lineTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          {item.specialInstructions && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-yellow-800 uppercase tracking-wide mb-1">
                    Special Instructions
                  </p>
                  <p className="text-sm text-yellow-700">
                    {item.specialInstructions}
                  </p>
                </div>
                {onEditInstructions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditInstructions(item)}
                    className="p-1 ml-2"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {onEditInstructions && !item.specialInstructions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditInstructions(item)}
                  className="p-2"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.menuItemId)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};