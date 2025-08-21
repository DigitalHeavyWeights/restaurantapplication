import { create } from 'zustand';
import { Order, KitchenOrder } from '../types/order';
import { apiClient } from '../lib/api';

// Define the order status type
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface OrderState {
  currentOrder: Order | null;
  kitchenQueue: KitchenOrder[];
  isLoading: boolean;
  error: string | null;
 
  // Actions
  createOrder: (orderData: any) => Promise<Order>;
  getOrder: (orderId: number) => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>; // Changed to OrderStatus
  loadKitchenQueue: () => Promise<void>;
  clearCurrentOrder: () => void;
  clearError: () => void;
}



export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: null,
  kitchenQueue: [],
  isLoading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const order = await apiClient.createOrder(orderData);
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create order',
        isLoading: false
      });
      throw error;
    }
  },

  getOrder: async (orderId: number) => {
    set({ isLoading: true, error: null });
    try {
      const order = await apiClient.getOrder(orderId);
      set({ currentOrder: order, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load order',
        isLoading: false
      });
    }
  },

  updateOrderStatus: async (orderId: number, status: OrderStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, status);
     
      // Update current order if it matches
      const { currentOrder } = get();
      if (currentOrder && currentOrder.orderId === orderId) {
        set({
          currentOrder: { ...currentOrder, orderStatus: status }
        });
      }
      
      // Update kitchen queue
      set({
        kitchenQueue: get().kitchenQueue.map(order =>
          order.orderId === orderId ? { ...order, orderStatus: status } : order
        )
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update order status' });
      throw error;
    }
  },

  
  loadKitchenQueue: async () => {
    set({ isLoading: true, error: null });
    try {
      const queue = await apiClient.getKitchenQueue();
      set({ kitchenQueue: queue, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load kitchen queue',
        isLoading: false
      });
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
  clearError: () => set({ error: null }),
}));