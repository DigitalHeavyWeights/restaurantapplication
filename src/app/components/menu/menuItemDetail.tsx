import React, { useState } from 'react';
import { Plus, Minus, Clock, AlertTriangle, X } from 'lucide-react';
import { MenuItemDetail as MenuItemDetailType } from '../../types/menu';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

interface MenuItemDetailProps {
  item: MenuItemDetailType;
  onClose: () => void;
}

export const MenuItemDetail: React.FC<MenuItemDetailProps> = ({ item, onClose }) => {
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    
    addItem(item, quantity, specialInstructions);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${item.itemName} added to cart`,
      duration: 2000
    });
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const hasAllergens = item.ingredients.some(ing => ing.allergenInfo);
  const totalPrice = item.price * quantity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {item.itemName}
          </h2>
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl font-bold text-primary-600">
              ${item.price.toFixed(2)}
            </span>
            {item.prepTimeMinutes && (
              <div className="flex items-center space-x-1 text-neutral-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{item.prepTimeMinutes} min</span>
              </div>
            )}
            <Badge variant="secondary" size="sm">
              {item.category}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Availability Status */}
      {!item.isAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-medium text-red-800">Currently Unavailable</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            This item is temporarily out of stock
          </p>
        </div>
      )}

      {/* Description */}
      {item.description && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-2">Description</h3>
          <p className="text-neutral-700 leading-relaxed">{item.description}</p>
        </div>
      )}

      {/* Ingredients */}
      {item.ingredients.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3">Ingredients</h3>
          <div className="grid grid-cols-1 gap-2">
            {item.ingredients.map((ingredient) => (
              <div
                key={ingredient.ingredientId}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-neutral-900">
                    {ingredient.ingredientName}
                  </span>
                  {ingredient.allergenInfo && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ {ingredient.allergenInfo}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-600">
                    {ingredient.quantityNeeded} units
                  </span>
                  {ingredient.isOptional && (
                    <Badge variant="secondary" size="sm">
                      Optional
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergen Warning */}
      {hasAllergens && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800 mb-1">Allergen Information</h4>
              <p className="text-sm text-orange-700">
                This item contains ingredients that may cause allergic reactions. 
                Please review the ingredient list carefully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Special Instructions */}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-2">Special Instructions (Optional)</h3>
        <Input
          placeholder="e.g., No onions, extra sauce, etc."
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3">Quantity</h3>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <span className="text-xl font-semibold text-neutral-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
              className="w-10 h-10 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-neutral-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          fullWidth
          className="h-14 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {item.isAvailable ? `Add ${quantity} to Cart` : 'Currently Unavailable'}
        </Button>
      </div>
    </div>
  );
};