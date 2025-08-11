'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Loading } from './components/ui/Loading';
import { 
  ChefHat, Clock, Star, MapPin, Truck, Phone, Heart, ShoppingCart, 
  Users, Award, Zap, CheckCircle, ArrowRight, Menu as MenuIcon,
  Instagram, Facebook, Twitter, Home, User, BarChart3, Package,
  Flame, Crown, ThumbsUp, Smile, Utensils, Gift
} from 'lucide-react';
import { MenuItem } from './types/menu';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { apiClient } from './lib/api';
import { MenuCarousel } from './components/menu/MenuCarousel';


export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadFeaturedItems();
  }, []);


  const loadFeaturedItems = async () => {
    try {
      const items = await apiClient.getMenuItems({ availableOnly: true });
      setFeaturedItems(items.slice(0, 8)); // Load more items for carousel
    } catch (error) {
      console.error('Failed to load featured items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    router.push('/menu');
  };

  const cartItems = getTotalItems();

  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-accent-50 to-secondary-50">
      



{/* MASSIVE Hero Section */}
<div className="relative min-h-screen flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-600 overflow-hidden">
  {/* Full hero background image - behind everything */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('./images/hero-background.png')",
      zIndex: 1
    }}
  ></div>
  
  {/* Background Image - Trees on left side for desktop */}
  <div 
    className="absolute inset-y-0 left-0 w-1/2 bg-cover bg-center bg-no-repeat md:block hidden"
    style={{
      backgroundImage: "url('./images/trees-background.png')",
      zIndex: 11
    }}
  ></div>
  
  {/* Mobile Background Image - Full width behind text */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden block opacity-40"
    style={{
      backgroundImage: "url('./images/HyenasHeroImage.png')",
      zIndex: 5
    }}
  ></div>
  
  {/* Remove the absolute positioned image since we're using grid */}
  
  {/* Gradient Overlay - Above background image */}
  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-800/70 to-primary-600/60 z-10"></div>
  
  {/* Background Pattern */}
  <div className="absolute inset-0 z-15">
    <div className="absolute top-10 right-10 w-64 h-64 bg-secondary-400 rounded-full opacity-20 animate-pulse"></div>
    <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-500 rounded-full opacity-20 animate-bounce"></div>
    <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent-400 rounded-full opacity-10 animate-ping"></div>
  </div>
  
  {/* Hero Content - Centered and Balanced */}
  <div className="relative z-20 flex-1 flex items-center justify-center py-20 sm:py-24 lg:py-32">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-start relative">
        {/* Black background only behind the grid content area on desktop */}
        <div className="hidden md:block absolute inset-0 bg-black/60 rounded-2xl" style={{zIndex: 12}}></div>
        
        {/* Left Side - Content (with trees background behind) */}
        <div className="text-center md:text-left md:pl-8 lg:pl-12 space-y-6 sm:space-y-8 relative z-20">
          {/* Status Badge */}
          <div className="inline-flex items-center bg-secondary-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl mb-6 sm:mb-8 shadow-xl border-4 border-accent-400">
            <Smile className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-bounce" />
            <span className="text-sm sm:text-lg font-black tracking-wider">🎉 THE PACK IS HUNTING IN EUGENE!</span>
          </div>
          
          {/* MASSIVE Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black text-white mb-4 sm:mb-6 leading-none">
            <span className="block">LAUGH.</span>
            <span className="block">FEAST.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-secondary-400 to-primary-400">
              HOWL!
            </span>
          </h1>
          
          {/* Subheading */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-accent-200 font-bold max-w-2xl mx-auto md:mx-0">
              WHERE EVERY BITE MAKES THE WHOLE PACK HAPPY!
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white max-w-xl mx-auto md:mx-0">
              🍔 Gourmet Burgers • 🍟 Crispy Sides • 🥤 Fresh Drinks
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start pt-4 sm:pt-6">
            <Button
              size="lg"
              onClick={() => router.push('/menu')}
              className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-black text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
            >
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              HUNT THE MENU
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/locations')}
              className="border-4 border-white text-white hover:bg-white hover:text-neutral-900 font-black text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-2xl transition-all"
            >
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              FIND THE PACK
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center pt-6 sm:pt-8">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent-400 mb-1">4.9</div>
              <div className="text-xs sm:text-sm text-white font-bold">PACK RATING</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent-400 mb-1">15</div>
              <div className="text-xs sm:text-sm text-white font-bold">MIN PREP</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent-400 mb-1">100+</div>
              <div className="text-xs sm:text-sm text-white font-bold">HAPPY HYENAS</div>
            </div>
          </div>
        </div>

        {/* Right Side - Background Image matching text boundaries */}
        <div 
          className="hidden md:block bg-cover bg-center bg-no-repeat h-full relative z-20"
          style={{
            backgroundImage: "url('./images/HyenasHeroImage.png')"
          }}
        ></div>
      </div>
    </div>
  </div>
  
  {/* Overshadow Burn Transition Effect */}
  <div className="relative z-20 h-8 sm:h-12 lg:h-16">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-neutral-900/60"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-primary-600/30 via-neutral-800/50 to-neutral-50"></div>
  </div>
</div>


{/* TODAY'S SPECIAL - Compact Pack Attack Style */}
<div className="py-12 xl:py-18">
  <div className="max-w-screen-xl xl:max-w-screen-2xl mx-auto px-4 lg:px-8">
    <div className="relative overflow-hidden rounded-2xl xl:rounded-3xl shadow-xl border-4 xl:border-8 border-accent-400">
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/HyenasDealImage.png)',
          backgroundSize: isMobile ? 'cover' : '100% 100%'
        }}
      />
      
      {/* Subtle black overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Simplified Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-6 left-6 text-4xl opacity-20 animate-bounce">🍟</div>
        <div className="absolute top-6 right-6 text-4xl opacity-20">🎉</div>
      </div>
      
      <div className="relative z-10 p-6 md:p-8 xl:p-12">
        
        <div className="grid lg:grid-cols-3 gap-6 xl:gap-12 items-center xl:min-h-[500px]">
          
          {/* Left: Main Content */}
          <div className="lg:col-span-2 text-white space-y-4">
            
            {/* Header with Badge and Pricing in One Line */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="inline-flex items-center bg-gradient-to-r from-accent-400 to-accent-300 text-brand-black px-4 py-2 rounded-full shadow-lg border-2 border-white">
                <Crown className="w-4 h-4 mr-2" />
                <span className="font-black text-sm lg:text-base">ALPHA'S CHOICE!</span>
              </div>
              
              <div className="bg-primary-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg border-2 border-accent-400 animate-pulse">
                <span className="font-black text-xs lg:text-sm">LIMITED TIME!</span>
              </div>
              
              <div className="flex items-center space-x-2 ml-auto">
                <span className="line-through text-white/70 text-lg font-bold">$24.99</span>
                <span className="text-2xl lg:text-3xl font-black text-accent-300">$18.99</span>
                <div className="bg-gradient-to-r from-accent-400 to-accent-300 text-brand-black font-black text-xs px-3 py-1 rounded-full border-2 border-white">
                  SAVE $6!
                </div>
              </div>
            </div>
            
            {/* Compact Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-black leading-tight drop-shadow-2xl">
              THE PACK ATTACK FEAST
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl xl:text-2xl font-bold text-accent-100 drop-shadow-lg mb-4">
              The ultimate combo that feeds the whole pack!
            </p>
            
            {/* Compact Menu Items - Horizontal Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4 text-sm md:text-base xl:text-lg font-bold">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="text-2xl">🍔</span>
                <div>
                  <div className="text-white">Alpha Burger</div>
                  <div className="text-accent-300 text-xs">(Double Patty)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="text-2xl">🍟</span>
                <div>
                  <div className="text-white">Howling Fries</div>
                  <div className="text-accent-300 text-xs">(Large)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="text-2xl">🥤</span>
                <div>
                  <div className="text-white">Pack Shake</div>
                  <div className="text-accent-300 text-xs">(Any Flavor)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="text-2xl">🧅</span>
                <div>
                  <div className="text-white">Onion Rings</div>
                  <div className="text-accent-300 text-xs">(Bonus!)</div>
                </div>
              </div>
            </div>
          </div>
         
          {/* Right: Single Image */}
          <div className="relative text-center">
            <div className="relative inline-block group">
              <div className="w-48 h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72 mx-auto bg-gradient-to-br from-accent-400 via-accent-300 to-accent-200 rounded-2xl p-6 xl:p-8 shadow-xl border-4 xl:border-6 border-white hover:scale-105 transition-transform backdrop-blur-sm">
                <img 
                  src="/api/placeholder/200/200" 
                  alt="Pack Attack Feast - Complete meal"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center text-6xl">
                  🍔
                </div>
              </div>
              
              {/* Single Floating Badge */}
              <div className="absolute -top-3 -right-3 bg-accent-400/90 backdrop-blur-sm text-brand-black px-3 py-1 rounded-full font-black text-sm border-2 border-white shadow-lg">
                HOT & FRESH!
              </div>
            </div>
            
            {/* Compact Rating */}
            <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
              <div className="flex space-x-1 mr-2">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-accent-300 fill-current" />
                ))}
              </div>
              <span className="text-white font-bold text-sm">5.0 Pack Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  {/* Menu Carousel Section */}
<div className="py-24 relative">
  {/* Background image for the entire section */}
  <div 
    className="absolute inset-0 w-full h-full"
    style={{ 
      backgroundImage: 'url(/images/menuimage.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  />
  <div className="absolute inset-0 bg-black/20" />
  
  <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 relative z-10">
    <MenuCarousel
      featuredItems={featuredItems}
      onItemClick={handleItemClick}
      isLoading={isLoading}
    />
  </div>
</div>

      {/* Why Choose Us Section */}
      <div className="py-24 bg-gradient-to-br from-secondary-50 to-accent-50">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-neutral-900 mb-4">
              WHY THE PACK CHOOSES US
            </h2>
            <p className="text-xl text-neutral-600 font-bold max-w-3xl mx-auto">
              We're not just another restaurant - we're a pack that hunts for the perfect meal! 🐺
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-12 h-12 text-secondary-500" />,
                title: 'LIGHTNING FAST',
                description: 'Hunt down your food in under 15 minutes!'
              },
              {
                icon: <Award className="w-12 h-12 text-accent-500" />,
                title: 'PACK QUALITY',
                description: 'Fresh ingredients, no compromises!'
              },
              {
                icon: <ThumbsUp className="w-12 h-12 text-primary-500" />,
                title: 'HYENA APPROVED',
                description: '4.9/5 stars from our hungry pack!'
              },
              {
                icon: <Heart className="w-12 h-12 text-pink-500" />,
                title: 'MADE WITH LOVE',
                description: 'Every bite crafted with pack passion!'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 border-secondary-200 hover:border-secondary-400 rounded-2xl">
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-xl font-black text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 font-medium">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

  {/* Contact/Location Section */}
<div className="py-24 relative overflow-hidden">
  {/* Background Image */}
  <div 
  className="absolute inset-0 bg-center bg-no-repeat w-full h-full"
  style={{
    backgroundImage: 'url(/images/hyenasden.png)',
    backgroundSize: isMobile ? 'cover' : '100% 100%'
  }}
/>
  
  {/* Gradient Overlay - maintains the color scheme but transparent */}
  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/70 to-secondary-800/70" />
  
  <div className="relative z-10 max-w-screen-2xl mx-auto px-4 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6">
          FIND THE PACK
        </h2>
        <p className="text-xl text-neutral-300 mb-8 font-bold">
          Come howl with us in Eugene! The pack is always ready to serve up some legendary bites.
        </p>
       
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-4 text-white">
            <MapPin className="w-6 h-6 text-accent-400" />
            <span className="text-lg font-bold">123 Pack Street, Eugene, OR 97401</span>
          </div>
          <div className="flex items-center space-x-4 text-white">
            <Phone className="w-6 h-6 text-accent-400" />
            <span className="text-lg font-bold">(541) HYENA-PACK</span>
          </div>
          <div className="flex items-center space-x-4 text-white">
            <Clock className="w-6 h-6 text-accent-400" />
            <span className="text-lg font-bold">Mon-Sun: 11AM - 10PM</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-black px-8 py-4 rounded-2xl"
          >
            GET DIRECTIONS
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-black px-8 py-4 rounded-2xl"
          >
            CALL THE PACK
          </Button>
        </div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-black text-neutral-900 mb-6">PACK HOURS</h3>
        <div className="space-y-3">
          {[
            { day: 'Monday - Thursday', hours: '11:00 AM - 9:00 PM' },
            { day: 'Friday - Saturday', hours: '11:00 AM - 10:00 PM' },
            { day: 'Sunday', hours: '12:00 PM - 8:00 PM' }
          ].map((schedule, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-200">
              <span className="font-bold text-neutral-900">{schedule.day}</span>
              <span className="text-secondary-600 font-bold">{schedule.hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-black mb-4">THE HUNGRY HYENA</h3>
              <p className="text-neutral-400 font-medium">
                Where the pack comes to hunt for legendary food! 🐺
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-4">QUICK LINKS</h4>
              <div className="space-y-2">
                <a href="/menu" className="block text-neutral-400 hover:text-white font-medium">Menu</a>
                <a href="/locations" className="block text-neutral-400 hover:text-white font-medium">Locations</a>
                <a href="/contact" className="block text-neutral-400 hover:text-white font-medium">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-4">FOLLOW THE PACK</h4>
              <div className="flex space-x-4">
                <Instagram className="w-6 h-6 text-neutral-400 hover:text-white cursor-pointer" />
                <Facebook className="w-6 h-6 text-neutral-400 hover:text-white cursor-pointer" />
                <Twitter className="w-6 h-6 text-neutral-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-4">JOIN THE PACK</h4>
              <p className="text-neutral-400 font-medium mb-4">
                Get the latest howls about new menu items!
              </p>
              <Button className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-black rounded-xl">
                SUBSCRIBE
              </Button>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
            <p className="text-neutral-500">&copy; 2024 The Hungry Hyena. All rights reserved. 🐺</p>
          </div>
        </div>
      </footer>
    </div>
  );
}