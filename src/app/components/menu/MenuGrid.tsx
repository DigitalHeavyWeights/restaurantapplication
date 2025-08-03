'use client'

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { MenuItemCard } from './MenuItemCard';
import { CategoryFilter } from './CategoryFilter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { apiClient } from '../../lib/api';

interface MenuGridProps {
  onItemSelect?: (item: MenuItem) => void;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  onItemSelect,
  categoryFilter = 'all',
  onCategoryChange
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceFilter, setPriceFilter] = useState<number | null>(null);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    setIsLoading(true);
    try {
      const [items, cats] = await Promise.all([
        apiClient.getMenuItems({ availableOnly: true }),
        apiClient.getMenuCategories()
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load menu data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || 
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesPrice = priceFilter === null || item.price <= priceFilter;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (isLoading) {
    return <Loading text="Loading menu..." className="py-12" />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="flex-1"
          />
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            className="px-3"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={categoryFilter}
          onCategoryChange={onCategoryChange || (() => {})}
        />

        {/* Additional Filters */}
        {showFilters && (
          <div className="bg-neutral-50 p-4 rounded-xl space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="Enter max price"
                value={priceFilter || ''}
                onChange={(e) => setPriceFilter(e.target.value ? Number(e.target.value) : null)}
                fullWidth={false}
                className="w-32"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700">View</span>
              <div className="flex space-x-1">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-1">No items found</h3>
          <p className="text-neutral-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            : 'space-y-3'
        }>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.menuItemId}
              item={item}
              onViewDetails={onItemSelect}
              className={viewMode === 'list' ? 'flex-row' : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
};