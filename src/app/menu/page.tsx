'use client';
import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { MenuGrid } from '../components/menu/MenuGrid';
import { MenuItemDetail } from '../components/menu/menuItemDetail';
import { BottomSheet } from '../components/ui/BottomSheet';
import { MenuItem, MenuItemDetail as MenuItemDetailType } from '../types/menu';
import { apiClient } from '../lib/api';
import { Search, Filter, Utensils, Crown, Flame } from 'lucide-react';

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItemDetailType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleItemSelect = async (item: MenuItem) => {
    try {
      const detailedItem = await apiClient.getMenuItem(item.menuItemId);
      setSelectedItem(detailedItem);
    } catch (error) {
      console.error('Failed to load item details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-accent-50 to-secondary-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/menuimage.png)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-800/70 to-primary-600/60" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-hyena-pattern" />
        
        {/* Content */}
        <div className="relative z-10 pt-6 pb-12">
          <Header
            title=""
            showSearch
            onSearch={() => {/* Implement search */}}
          />
          
          {/* Hero Content */}
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 text-center mt-8">
            {/* Pack Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-accent-400 to-accent-300 text-brand-black px-6 py-3 rounded-2xl mb-6 shadow-xl border-4 border-white">
              <Crown className="w-5 h-5 mr-2 animate-bounce" />
              <span className="font-black text-lg tracking-wider">🍽️ THE PACK'S FEAST!</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-4 leading-none drop-shadow-2xl">
              <span className="block">HUNT THE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-secondary-400 to-primary-400">
                MENU
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl md:text-3xl text-accent-200 font-bold max-w-3xl mx-auto drop-shadow-lg">
              LEGENDARY BITES THAT MAKE THE WHOLE PACK HOWL! 🐺
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center mt-8 max-w-lg mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="text-2xl sm:text-3xl font-black text-accent-400 mb-1">50+</div>
                <div className="text-xs sm:text-sm text-white font-bold">PACK FAVORITES</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="text-2xl sm:text-3xl font-black text-accent-400 mb-1">100%</div>
                <div className="text-xs sm:text-sm text-white font-bold">FRESH HUNT</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="text-2xl sm:text-3xl font-black text-accent-400 mb-1">4.9</div>
                <div className="text-xs sm:text-sm text-white font-bold">PACK RATING</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transition Effect */}
        <div className="relative z-20 h-8 sm:h-12">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-neutral-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-600/30 via-neutral-800/50 to-brand-cream"></div>
        </div>
      </div>

      {/* Menu Grid Section */}
      <div className="relative z-10 py-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-food-pattern" />
        
        <div className="relative max-w-screen-2xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-2xl mb-4 shadow-xl">
              <Utensils className="w-5 h-5 mr-2" />
              <span className="font-black text-lg">CHOOSE YOUR FEAST</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-neutral-900 mb-2">
              LEGENDARY MENU
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 font-bold max-w-2xl mx-auto">
              Every dish crafted to satisfy the hungriest hyenas! 🍔🍟
            </p>
          </div>

          {/* Menu Grid Component */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-secondary-200">
            <MenuGrid
              onItemSelect={handleItemSelect}
              categoryFilter={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-10" />
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-accent-400 to-accent-300 text-brand-black px-8 py-4 rounded-2xl shadow-xl border-4 border-white">
            <Flame className="w-6 h-6 mr-3 animate-bounce" />
            <span className="font-black text-xl">CAN'T DECIDE? LET THE PACK HELP!</span>
          </div>
        </div>
      </div>

      {/* Enhanced Item Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title=""
      >
        {selectedItem && (
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-hyena-pattern" />
            
            {/* Header with brand styling */}
            <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 -mx-4 -mt-4 mb-6 rounded-t-3xl">
              <div className="text-center">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl mb-2">
                  <Crown className="w-4 h-4 mr-2" />
                  <span className="font-black text-sm">PACK'S CHOICE</span>
                </div>
                <h2 className="text-2xl font-display font-black drop-shadow-lg">
                  FEAST DETAILS
                </h2>
              </div>
            </div>
            
            <div className="relative px-4">
              <MenuItemDetail
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
              />
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}