'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Loading } from '../../../components/ui/Loading';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  ToggleLeft, 
  ToggleRight,
  Trash2,
  DollarSign,
  Clock
} from 'lucide-react';
import { MenuItem } from '../../../types/menu';
import { apiClient } from '../../../lib/api';
import { useUIStore } from '../../../store/uiStore';

export default function ManagerMenuPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    loadMenuData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchQuery, selectedCategory, availabilityFilter]);

  const loadMenuData = async () => {
    setIsLoading(true);
    try {
      const [items, cats] = await Promise.all([
        apiClient.getMenuItems({ availableOnly: false }),
        apiClient.getMenuCategories()
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load menu data:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load menu data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(item => 
        availabilityFilter === 'available' ? item.isAvailable : !item.isAvailable
      );
    }

    setFilteredItems(filtered);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await apiClient.updateMenuItemAvailability(item.menuItemId, !item.isAvailable);
      setMenuItems(prevItems =>
        prevItems.map(i =>
          i.menuItemId === item.menuItemId
            ? { ...i, isAvailable: !i.isAvailable }
            : i
        )
      );
      addToast({
        type: 'success',
        title: 'Updated',
        message: `${item.itemName} is now ${!item.isAvailable ? 'available' : 'unavailable'}`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update item availability'
      });
    }
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.itemName}"?`)) return;

    try {
      await apiClient.deleteMenuItem(item.menuItemId);
      setMenuItems(prevItems =>
        prevItems.filter(i => i.menuItemId !== item.menuItemId)
      );
      addToast({
        type: 'success',
        title: 'Deleted',
        message: `${item.itemName} has been deleted`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete menu item'
      });
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading menu..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-28">
        <Header 
          title="Menu Management" 
          showBack
         actions={
  <Button
    variant="primary"
    size="sm"
    onClick={() => router.push('/manager/dashboard/menu/create')}
    className="px-2 py-1 text-xs h-7"
  >
    <Plus className="w-3 h-3 mr-1" />
    <span className="hidden sm:inline">Add Item</span>
    <span className="sm:hidden">Add</span>
  </Button>
}
        />
        
        <div className="p-4 space-y-6">
          {/* Search and Filters */}
          <div className="space-y-3">
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />

            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Availability Filter */}
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Items' },
                { value: 'available', label: 'Available' },
                { value: 'unavailable', label: 'Unavailable' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setAvailabilityFilter(filter.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    availabilityFilter === filter.value
                      ? 'bg-secondary-500 text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center" padding="sm">
              <div className="text-lg font-bold text-neutral-900">{menuItems.length}</div>
              <div className="text-xs text-neutral-600">Total Items</div>
            </Card>
            <Card className="text-center" padding="sm">
              <div className="text-lg font-bold text-green-600">
                {menuItems.filter(i => i.isAvailable).length}
              </div>
              <div className="text-xs text-neutral-600">Available</div>
            </Card>
            <Card className="text-center" padding="sm">
              <div className="text-lg font-bold text-red-600">
                {menuItems.filter(i => !i.isAvailable).length}
              </div>
              <div className="text-xs text-neutral-600">Unavailable</div>
            </Card>
          </div>

          {/* Menu Items List */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Items Found</h3>
              <p className="text-neutral-600 mb-6">
                {searchQuery || selectedCategory !== 'all' || availabilityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first menu item'
                }
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/manager/dashboard/menu/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
             

            {filteredItems.map((item) => (
  <Card key={item.menuItemId} padding="md">
    <div className="flex items-start space-x-4">
      {/* Item Image Placeholder */}
      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">🍽️</span>
      </div>

      {/* Item Details - Takes full available width */}
      <div className="flex-1 min-w-0">
        {/* Title and Badge Row */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 text-base truncate">
              {item.itemName}
            </h3>
            <p className="text-sm text-neutral-600 line-clamp-2">
              {item.description || 'No description available'}
            </p>
          </div>
          <Badge
            variant={item.isAvailable ? 'success' : 'danger'}
            size="sm"
            className="flex-shrink-0"
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>

        {/* Price, Time, Category and Actions Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-wrap min-w-0 flex-1">
            <div className="flex items-center space-x-1 flex-shrink-0">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600 text-sm">
                ${item.price.toFixed(2)}
              </span>
            </div>
            {item.prepTimeMinutes && (
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-neutral-600">
                  {item.prepTimeMinutes}m
                </span>
              </div>
            )}
            <Badge variant="secondary" size="sm" className="flex-shrink-0 text-xs">
              {item.category}
            </Badge>
          </div>

        <div className="flex items-center flex-shrink-0">
{/* Availability Toggle */}
<button
  onClick={() => handleToggleAvailability(item)}
  className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors"
  title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
>
  {item.isAvailable ? (
    <ToggleRight className="w-4 h-4 text-green-500" />
  ) : (
    <ToggleLeft className="w-4 h-4 text-neutral-400" />
  )}
</button>

{/* Edit Button */}
<Button
  variant="ghost"
  size="sm"
  onClick={() => router.push(`/manager/dashboard/menu/${item.menuItemId}/edit`)}
  className="p-1.5 min-w-0"
  title="Edit item"
>
  <Edit className="w-4 h-4" />
</Button>

{/* Delete Button */}
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleDeleteItem(item)}
  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 min-w-0"
  title="Delete item"
>
  <Trash2 className="w-4 h-4" />
</Button>
</div>
      </div>
    </div>
    </div>
  </Card>
))} 
       </div>   
          
)}{/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/manager/dashboard/menu/create')}
                className="h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/manager/dashboard/menu/categories')}
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>

               <Button
                variant="outline"
                onClick={() => router.push('/manager/dashboard/menus/create')}
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
              
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}