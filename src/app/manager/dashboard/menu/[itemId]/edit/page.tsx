'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '../../../../../components/layout/Header';
import { Card } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/Button';
import { Input } from '../../../../../components/ui/Input';
import { Loading } from '../../../../../components/ui/Loading';
import { ProtectedRoute } from '../../../../../components/auth/ProtectedRoute';
import { Save, X } from 'lucide-react';
import { MenuItemDetail } from '../../../../../types/menu';
import { apiClient } from '../../../../../lib/api';
import { useUIStore } from '../../../../../store/uiStore';

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useUIStore();
  const [menuItem, setMenuItem] = useState<MenuItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    prepTimeMinutes: ''
  });

  const categories = [
    'Appetizer',
    'Main Course',
    'Side',
    'Dessert',
    'Beverage',
    'Special'
  ];

  useEffect(() => {
    if (params.menuItemId) {
      loadMenuItem(Number(params.menuItemId));
    }
  }, [params.menuItemId]);

  const loadMenuItem = async (menuItemId: number) => {
    setIsLoading(true);
    try {
      const item = await apiClient.getMenuItem(menuItemId);
      setMenuItem(item);
      setFormData({
        itemName: item.itemName,
        description: item.description || '',
        price: item.price.toString(),
        category: item.category,
        isAvailable: item.isAvailable,
        prepTimeMinutes: item.prepTimeMinutes?.toString() || ''
      });
    } catch (error) {
      console.error('Failed to load menu item:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load menu item'
      });
      router.push('/manager/menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItem) return;

    setIsSaving(true);
    try {
      const updateData = {
        itemName: formData.itemName,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        category: formData.category,
        isAvailable: formData.isAvailable,
        prepTimeMinutes: formData.prepTimeMinutes ? parseInt(formData.prepTimeMinutes) : undefined
      };

      await apiClient.updateMenuItem(menuItem.menuItemId, updateData);
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Menu item updated successfully!'
      });
      
      router.push('/manager/menu');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update menu item'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading menu item..." />;
  }

  if (!menuItem) {
    return (
      <div className="pb-20">
        <Header title="Menu Item Not Found" showBack />
        <div className="p-4 text-center py-12">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Menu Item Not Found</h3>
          <p className="text-neutral-600 mb-6">The menu item you're looking for doesn't exist</p>
          <Button variant="primary" onClick={() => router.push('/manager/menu')}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Edit Menu Item" 
          showBack
        />
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              {/* Item Name */}
              <Input
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter item description"
                  rows={3}
                  className="block w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>

              {/* Price */}
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prep Time */}
              <Input
                label="Preparation Time (minutes)"
                name="prepTimeMinutes"
                type="number"
                min="1"
                value={formData.prepTimeMinutes}
                onChange={handleChange}
                placeholder="Enter prep time in minutes"
              />

              {/* Availability */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-neutral-700">
                  Available for ordering
                </label>
              </div>
            </div>
          </Card>

          {/* Ingredients Section */}
          {menuItem.ingredients && menuItem.ingredients.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ingredients</h3>
              <div className="space-y-2">
                {menuItem.ingredients.map((ingredient) => (
                  <div key={ingredient.ingredientId} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-neutral-900">{ingredient.ingredientName}</span>
                      {ingredient.allergenInfo && (
                        <p className="text-sm text-orange-600">⚠️ {ingredient.allergenInfo}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-neutral-600">
                        {ingredient.quantityNeeded} units
                      </span>
                      {ingredient.isOptional && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}