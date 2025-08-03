'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '../../../../components/layout/Header';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { Loading } from '../../../../components/ui/Loading';
import { ProtectedRoute } from '../../../../components/auth/ProtectedRoute';
import { Plus, Trash2, BarChart3 } from 'lucide-react';
import { MenuItem } from '../../../../types/menu';
import { apiClient } from '../../../../lib/api';
import { useUIStore } from '../../../../store/uiStore';

interface CategoryStats {
  category: string;
  itemCount: number;
  availableCount: number;
  averagePrice: number;
}

export default function ManageCategoriesPage() {
  const { addToast } = useUIStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    loadCategoryData();
  }, []);

  const loadCategoryData = async () => {
    setIsLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        apiClient.getMenuCategories(),
        apiClient.getMenuItems({ availableOnly: false })
      ]);
      
      setCategories(cats);
      
      // Calculate statistics for each category
      const stats = cats.map(category => {
        const categoryItems = menuItems.filter(item => item.category === category);
        const availableItems = categoryItems.filter(item => item.isAvailable);
        const avgPrice = categoryItems.length > 0 
          ? categoryItems.reduce((sum, item) => sum + item.price, 0) / categoryItems.length
          : 0;

        return {
          category,
          itemCount: categoryItems.length,
          availableCount: availableItems.length,
          averagePrice: avgPrice
        };
      });
      
      setCategoryStats(stats);
    } catch (error) {
      console.error('Failed to load category data:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load category data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    // Check if category already exists
    if (categories.includes(newCategory.trim())) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Category already exists'
      });
      return;
    }

    setIsAddingCategory(true);
    try {
      // Note: In a real implementation, you'd need an API endpoint to add categories
      // For now, we'll just update the local state
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      
      // Add empty stats for the new category
      setCategoryStats(prev => [...prev, {
        category: newCategory.trim(),
        itemCount: 0,
        availableCount: 0,
        averagePrice: 0
      }]);
      
      setNewCategory('');
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Category added successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to add category'
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    const categoryData = categoryStats.find(stat => stat.category === category);
    
    if (categoryData && categoryData.itemCount > 0) {
      addToast({
        type: 'error',
        title: 'Cannot Delete',
        message: `Category "${category}" has ${categoryData.itemCount} items. Remove all items first.`
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete the "${category}" category?`)) return;

    try {
      // Note: In a real implementation, you'd need an API endpoint to delete categories
      setCategories(prev => prev.filter(cat => cat !== category));
      setCategoryStats(prev => prev.filter(stat => stat.category !== category));
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Category deleted successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete category'
      });
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading categories..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header title="Manage Categories" showBack />
        
        <div className="p-4 space-y-6">
          {/* Add New Category */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Add New Category</h3>
            <div className="flex space-x-3">
              <Input
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleAddCategory}
                isLoading={isAddingCategory}
                disabled={!newCategory.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </Card>

          {/* Categories Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center" padding="md">
              <div className="text-2xl font-bold text-neutral-900">{categories.length}</div>
              <div className="text-sm text-neutral-600">Total Categories</div>
            </Card>
            <Card className="text-center" padding="md">
              <div className="text-2xl font-bold text-primary-600">
                {categoryStats.reduce((sum, stat) => sum + stat.itemCount, 0)}
              </div>
              <div className="text-sm text-neutral-600">Total Items</div>
            </Card>
          </div>

          {/* Categories List */}
          {categoryStats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📁</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Categories</h3>
              <p className="text-neutral-600 mb-6">Start by adding your first category</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryStats
                .sort((a, b) => b.itemCount - a.itemCount)
                .map((stat) => (
                <Card key={stat.category} padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {stat.category}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {stat.itemCount} items
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-600">Available:</span>
                          <span className="ml-1 font-medium text-green-600">
                            {stat.availableCount}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Unavailable:</span>
                          <span className="ml-1 font-medium text-red-600">
                            {stat.itemCount - stat.availableCount}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Avg Price:</span>
                          <span className="ml-1 font-medium text-neutral-900">
                            ${stat.averagePrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(stat.category)}
                        disabled={stat.itemCount > 0}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Category Analytics */}
          {categoryStats.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Category Analytics
              </h3>
              
              <div className="space-y-4">
                {/* Most Popular Category */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Most Popular Category</h4>
                  <p className="text-green-700">
                    {categoryStats.reduce((max, stat) => 
                      stat.itemCount > max.itemCount ? stat : max
                    ).category} ({categoryStats.reduce((max, stat) => 
                      stat.itemCount > max.itemCount ? stat : max
                    ).itemCount} items)
                  </p>
                </div>

                {/* Highest Value Category */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Highest Average Price</h4>
                  <p className="text-blue-700">
                    {categoryStats.reduce((max, stat) => 
                      stat.averagePrice > max.averagePrice ? stat : max
                    ).category} (${categoryStats.reduce((max, stat) => 
                      stat.averagePrice > max.averagePrice ? stat : max
                    ).averagePrice.toFixed(2)} avg)
                  </p>
                </div>

                {/* Availability Rate */}
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Overall Availability</h4>
                  <p className="text-yellow-700">
                    {Math.round((categoryStats.reduce((sum, stat) => sum + stat.availableCount, 0) / 
                    Math.max(categoryStats.reduce((sum, stat) => sum + stat.itemCount, 0), 1)) * 100)}% 
                    of items are currently available
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}