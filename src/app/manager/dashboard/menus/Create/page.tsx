'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../../components/layout/Header';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { ProtectedRoute } from '../../../../components/auth/ProtectedRoute';
import { Save, X } from 'lucide-react';
import { apiClient } from '../../../../lib/api';
import { useUIStore } from '../../../../store/uiStore';

export default function CreateMenuPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    menuName: '',
    startDate: new Date().toISOString().split('T')[0], // Today's date
    endDate: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const createData = {
        menuName: formData.menuName,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isActive: formData.isActive
      };

      await apiClient.createMenu(createData);
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Menu created successfully!'
      });
      
      router.push('/manager/dashboard/menus');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create menu'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Create Menu" 
          showBack
        />
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Menu Information</h3>
            
            <div className="space-y-4">
              {/* Menu Name */}
              <Input
                label="Menu Name"
                name="menuName"
                value={formData.menuName}
                onChange={handleChange}
                placeholder="e.g., Breakfast Menu, Lunch Specials, Dinner Menu"
                required
              />

              {/* Start Date */}
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />

              {/* End Date (Optional) */}
              <Input
                label="End Date (Optional)"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                placeholder="Leave empty for permanent menu"
                
              />

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">
                  Active (available for ordering)
                </label>
              </div>
            </div>
          </Card>

          {/* Information Card */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1">ℹ️</div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">About Menus</h4>
                <p className="text-sm text-blue-800">
                  Menus help organize your items by time period or category. For example:
                  Breakfast Menu (6am-11am), Lunch Menu (11am-4pm), Dinner Menu (4pm-close).
                  You can add menu items to any menu after creation.
                </p>
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
              Create Menu
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}