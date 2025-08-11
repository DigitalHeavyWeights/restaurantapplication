import { create } from 'zustand';
import { CartItem } from '../types/order';
import { MenuItem } from '../types/menu';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  updateInstructions: (menuItemId: number, instructions: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (menuItem: MenuItem, quantity = 1, specialInstructions = '') => {
    const { items } = get();
    const existingItem = items.find(item => item.menuItemId === menuItem.menuItemId);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.menuItemId === menuItem.menuItemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lineTotal: (item.quantity + quantity) * menuItem.price,
                specialInstructions: specialInstructions || item.specialInstructions
              }
            : item
        )
      });
    } else {
      const newItem: CartItem = {
        menuItemId: menuItem.menuItemId,
        quantity,
        specialInstructions,
        menuItem,
        lineTotal: quantity * menuItem.price
      };
      set({ items: [...items, newItem] });
    }
  },

  removeItem: (menuItemId: number) => {
    set({
      items: get().items.filter(item => item.menuItemId !== menuItemId)
    });
  },

  updateQuantity: (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }

    set({
      items: get().items.map(item =>
        item.menuItemId === menuItemId
          ? {
              ...item,
              quantity,
              lineTotal: quantity * item.menuItem.price
            }
          : item
      )
    });
  },

  updateInstructions: (menuItemId: number, instructions: string) => {
    set({
      items: get().items.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    });
  },

  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set({ isOpen: !get().isOpen }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.lineTotal, 0);
  },
}));