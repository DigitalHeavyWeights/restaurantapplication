import React from 'react';
import { Plus, Clock, Info } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

interface MenuItemCardProps {
  item: MenuItem;
  onViewDetails?: (item: MenuItem) => void;
  className?: string;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onViewDetails,
  className = ''
}) => {
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item, 1);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${item.itemName} added to cart`,
      duration: 2000
    });
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(item);
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden ${className}`}
      onClick={handleViewDetails}
      padding="none"
      shadow="md"
    >
      {/* Image placeholder - replace with actual image */}
      <div className="h-32 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
        <div className="text-4xl">🍽️</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 text-base leading-tight mb-1">
              {item.itemName}
            </h3>
            <p className="text-sm text-neutral-600 line-clamp-2">
              {item.description || 'Delicious menu item'}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" size="sm">
              {item.category}
            </Badge>
            {item.prepTimeMinutes && (
              <div className="flex items-center text-xs text-neutral-500">
                <Clock className="w-3 h-3 mr-1" />
                {item.prepTimeMinutes}m
              </div>
            )}
          </div>
          
          {!item.isAvailable && (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </div>
          
          <div className="flex items-center space-x-2">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="p-2"
              >
                <Info className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="px-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};