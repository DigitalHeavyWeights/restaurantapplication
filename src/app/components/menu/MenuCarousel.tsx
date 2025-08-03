import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Star, ArrowRight } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface MenuCarouselProps {
  featuredItems: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  isLoading: boolean;
}

export const MenuCarousel: React.FC<MenuCarouselProps> = ({
  featuredItems,
  onItemClick,
  isLoading
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else if (width < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxSlide = Math.max(0, featuredItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlide));
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden min-h-[600px]">
        {/* Single Savanna Hunting Ground Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/menuimage.png)' }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Loading Content */}
        <div className="relative z-20 text-center py-24">
          <div className="text-6xl animate-bounce mb-4">🍔</div>
          <p className="text-lg font-bold text-white drop-shadow-lg">Loading pack favorites...</p>
        </div>
      </div>
    );
  }

  if (featuredItems.length === 0) {
    return (
      <div className="relative overflow-hidden min-h-[600px]">
        {/* Single Savanna Hunting Ground Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/menuimage.png)' }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* No Items Content */}
        <div className="relative z-20 text-center py-24">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-lg font-bold text-white drop-shadow-lg">No featured items available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-[600px]">
      {/* Single Savanna Hunting Ground Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/savanna-hunting-ground.jpg)' }}
      />
      
      {/* Subtle overlay for better content readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      
      {/* Main Carousel Content */}
      <div className="relative z-20 px-4 lg:px-8 py-16">
        {/* Carousel Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className='flex items-center gap-4 mb-2'>
              <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-2 drop-shadow-lg">
                PACK FAVORITES
              </h2>
              <img 
                src='/images/HyenasMenuImage.png' 
                alt="Hyena mascot"
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain drop-shadow-lg"
              />
            </div>
            <p className="text-lg text-white font-bold drop-shadow-lg">
              The legendary bites that make the whole pack howl! 🐺
            </p>
          </div>
          
          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="p-2 border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="p-2 border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ 
              transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`
            }}
          >
            {featuredItems.map((item, index) => (
              <div 
                key={item.menuItemId}
                className="flex-none"
                style={{ width: `calc(${100 / itemsPerView}% - 1rem)` }}
              >
                <Card 
                  className="group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-4 border-secondary-200 hover:border-secondary-400 h-full rounded-2xl bg-white/95 backdrop-blur-sm"
                  onClick={() => onItemClick(item)}
                  padding="none"
                >
                  {/* Special Badge for First Item */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-accent-400 text-neutral-900 font-black shadow-lg animate-pulse px-3 py-1 text-xs rounded-full">
                        🏆 PACK LEADER
                      </Badge>
                    </div>
                  )}
                  
                  {/* Image Section */}
                  <div className="h-40 bg-gradient-to-br from-secondary-100 to-accent-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/20 to-primary-500/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                        {item.category === 'Main Course' ? '🍔' : 
                         item.category === 'Side' ? '🍟' : 
                         item.category === 'Beverage' ? '🥤' : 
                         item.category === 'Dessert' ? '🧁' : '🍽️'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-secondary-800 font-bold text-xs px-2 py-1 rounded-full">
                        {item.category.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-neutral-800">4.{Math.floor(Math.random() * 4) + 6}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-display font-black text-neutral-900 mb-2 group-hover:text-secondary-600 transition-colors line-clamp-1">
                      {item.itemName.toUpperCase()}
                    </h3>
                    
                    <p className="text-neutral-700 mb-3 font-medium text-sm leading-relaxed line-clamp-2">
                      {item.description || 'Made with pack pride and wild flavor! Fresh, delicious, and guaranteed to make you howl! 😊'}
                    </p>
                    
                    {/* Price and Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-secondary-600">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.prepTimeMinutes && (
                        <div className="flex items-center text-neutral-600 bg-secondary-100 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="text-xs font-bold">{item.prepTimeMinutes}m</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-black px-4 py-2 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all w-full rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                    >
                      HUNT NOW
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex md:hidden items-center justify-center space-x-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="p-3 border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="p-3 border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 shadow-sm ${
                index === currentSlide 
                  ? 'bg-secondary-500' 
                  : 'bg-white/70 hover:bg-white/90'
              }`}
            />
          ))}
        </div>

        {/* View All Button - Floating above the hunting ground */}
        <div className="text-center mt-8">
          <Button
            size="lg"
            onClick={() => window.location.href = '/menu'}
            className="bg-white/90 backdrop-blur-sm border-4 border-secondary-500 text-secondary-600 hover:bg-secondary-500 hover:text-white font-black text-xl px-12 py-4 shadow-2xl transform hover:scale-105 transition-all rounded-2xl"
          >
            SEE FULL MENU
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};