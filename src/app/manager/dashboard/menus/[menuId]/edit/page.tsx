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
import { Menu } from '../../../../../types/menu';
import { apiClient } from '../../../../../lib/api';
import { useUIStore } from '../../../../../store/uiStore';

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useUIStore();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    menuName: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    if (params.menuId) {
      loadMenu(Number(params.menuId));
    }
  }, [params.menuId]);

  const loadMenu = async (menuId: number) => {
    setIsLoading(true);
    try {
      const menuData = await apiClient.getMenu(menuId);
      setMenu(menuData);
      setFormData({
        menuName: menuData.menuName,
        startDate: menuData.startDate,
        endDate: menuData.endDate || '',
        isActive: menuData.isActive
      });
    } catch (error) {
      console.error('Failed to load menu:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load menu'
      });
      router.push('/manager/dashboard/menus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu) return;

    setIsSaving(true);
    try {
      const updateData = {
        menuName: formData.menuName,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isActive: formData.isActive
      };

      await apiClient.updateMenu(menu.menuId, updateData);
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Menu updated successfully!'
      });
      
      router.push('/manager/dashboard/menus');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update menu'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading menu..." />;
  }

  if (!menu) {
    return (
      <div className="pb-20">
        <Header title="Menu Not Found" showBack />
        <div className="p-4 text-center py-12">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Menu Not Found</h3>
          <p className="text-neutral-600 mb-6">The menu you're looking for doesn't exist</p>
          <Button variant="primary" onClick={() => router.push('/manager/dashboard/menus')}>
            Back to Menus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Edit Menu" 
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

          {/* Menu Stats (if available) */}
          {menu && (
            <Card className="bg-neutral-50 border-neutral-200">
              <h4 className="font-medium text-neutral-900 mb-2">Menu Statistics</h4>
              <div className="text-sm text-neutral-600">
                <p>Menu ID: {menu.menuId}</p>
                <p>Created: {new Date(menu.startDate).toLocaleDateString()}</p>
                {menu.endDate && (
                  <p>Valid Until: {new Date(menu.endDate).toLocaleDateString()}</p>
                )}
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