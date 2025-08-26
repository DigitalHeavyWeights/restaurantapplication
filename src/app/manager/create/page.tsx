'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { Save, X } from 'lucide-react';
import { Menu } from '../../types/menu';
import { apiClient } from '../../lib/api';
import { useUIStore } from '../../store/uiStore';

export default function CreateMenuItemPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    menuId: '',
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
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const menuData = await apiClient.getMenus();
      setMenus(menuData.filter(m => m.isActive));
      if (menuData.length > 0) {
        setFormData(prev => ({ ...prev, menuId: menuData[0].menuId.toString() }));
      }
    } catch (error) {
      console.error('Failed to load menus:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load menus'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const createData = {
        menuId: parseInt(formData.menuId),
        itemName: formData.itemName,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        category: formData.category,
        isAvailable: formData.isAvailable,
        prepTimeMinutes: formData.prepTimeMinutes ? parseInt(formData.prepTimeMinutes) : undefined
      };

      await apiClient.createMenuItem(createData);
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Menu item created successfully!'
      });
      
      router.push('/manager/dashboard/menu');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create menu item'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Create Menu Item" 
          showBack
        />
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              {/* Menu Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Menu
                </label>
                <select
                  name="menuId"
                  value={formData.menuId}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option value="">Select a menu</option>
                  {menus.map((menu) => (
                    <option key={menu.menuId} value={menu.menuId}>
                      {menu.menuName}
                    </option>
                  ))}
                </select>
              </div>

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
              isLoading={isLoading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Item
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}