import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  toasts: Toast[];
  isSidebarOpen: boolean;
  isBottomSheetOpen: boolean;
  bottomSheetContent: React.ReactNode | null;
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // UI actions
  toggleSidebar: () => void;
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  isSidebarOpen: false,
  isBottomSheetOpen: false,
  bottomSheetContent: null,

  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set({ toasts: [...get().toasts, newToast] });
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter(toast => toast.id !== id) });
  },

  clearToasts: () => set({ toasts: [] }),
  
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
  
  openBottomSheet: (content) => set({ 
    isBottomSheetOpen: true, 
    bottomSheetContent: content 
  }),
  
  closeBottomSheet: () => set({ 
    isBottomSheetOpen: false, 
    bottomSheetContent: null 
  }),
}));