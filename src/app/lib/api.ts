import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { Menu, MenuItem, MenuItemDetail } from '../types/menu';
import { Order, CreateOrderRequest, KitchenOrder } from '../types/order';
import { Customer, CustomerFavorite, CustomerStats } from '../types/customer';
import { InventoryItem, LowStockAlert } from '../types/inventory';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = Cookies.get('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses and errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          Cookies.remove('auth-token');
          Cookies.remove('user-data');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  // Add this new method for token validation
async getCurrentUser(): Promise<AuthResponse> {
  const response = await this.client.get<AuthResponse>('/auth/me');
  return response.data;
}

  // Menu API
  async getMenus(): Promise<Menu[]> {
    const response = await this.client.get<Menu[]>('/menu');
    return response.data;
  }

  async getMenu(menuId: number): Promise<Menu & { menuItems: MenuItem[] }> {
    const response = await this.client.get(`/menu/${menuId}`);
    return response.data;
  }

  async getMenuItems(filters?: {
    category?: string;
    maxPrice?: number;
    availableOnly?: boolean;
  }): Promise<MenuItem[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.availableOnly !== undefined) params.append('availableOnly', filters.availableOnly.toString());
    
    const response = await this.client.get<MenuItem[]>(`/menu/items?${params}`);
    return response.data;
  }

  async getMenuItem(itemId: number): Promise<MenuItemDetail> {
    const response = await this.client.get<MenuItemDetail>(`/menu/items/${itemId}`);
    return response.data;
  }

  async getMenuCategories(): Promise<string[]> {
    const response = await this.client.get<string[]>('/menu/categories');
    return response.data;
  }

  // Order API
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.client.post<Order>('/order', orderData);
    return response.data;
  }

  async getOrder(orderId: number): Promise<Order> {
    const response = await this.client.get<Order>(`/order/${orderId}`);
    return response.data;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    await this.client.patch(`/order/${orderId}/status`, { orderStatus: status });
  }

  async addPayment(orderId: number, paymentData: {
    paymentMethod: string;
    paymentAmount: number;
    transactionId?: string;
  }): Promise<void> {
    await this.client.post(`/order/${orderId}/payment`, paymentData);
  }

  async cancelOrder(orderId: number): Promise<void> {
    await this.client.delete(`/order/${orderId}`);
  }

  // Kitchen API
  async getKitchenQueue(): Promise<KitchenOrder[]> {
    const response = await this.client.get<KitchenOrder[]>('/order/kitchen-queue');
    return response.data;
  }

  // Customer API
  async getCustomerProfile(): Promise<Customer> {
    const response = await this.client.get<Customer>('/customer/profile');
    return response.data;
  }

  async updateCustomerProfile(profileData: {
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<void> {
    await this.client.put('/customer/profile', profileData);
  }

  async getCustomerFavorites(): Promise<CustomerFavorite[]> {
    const response = await this.client.get<CustomerFavorite[]>('/customer/favorites');
    return response.data;
  }

  async addFavorite(menuItemId: number, favoriteName?: string): Promise<CustomerFavorite> {
    const response = await this.client.post<CustomerFavorite>('/customer/favorites', {
      menuItemId,
      favoriteName
    });
    return response.data;
  }

  async removeFavorite(favoriteId: number): Promise<void> {
    await this.client.delete(`/customer/favorites/${favoriteId}`);
  }

  async getCustomerOrders(filters?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<{
    orders: Order[];
    totalOrders: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    
    const response = await this.client.get(`/customer/orders?${params}`);
    return response.data;
  }

  async getCustomerStats(): Promise<CustomerStats> {
    const response = await this.client.get<CustomerStats>('/customer/stats');
    return response.data;
  }

  async registerBusinessProfile(profileData: {
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<Customer> {
    const response = await this.client.post<Customer>('/customer/register-business-profile', profileData);
    return response.data;
  }

  // Inventory API (Manager/Employee only)
  async getInventory(filters?: {
    lowStockOnly?: boolean;
    location?: string;
    search?: string;
  }): Promise<InventoryItem[]> {
    const params = new URLSearchParams();
    if (filters?.lowStockOnly) params.append('lowStockOnly', filters.lowStockOnly.toString());
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.client.get<InventoryItem[]>(`/inventory?${params}`);
    return response.data;
  }

  async getInventoryItem(itemId: number): Promise<InventoryItem> {
    const response = await this.client.get<InventoryItem>(`/inventory/${itemId}`);
    return response.data;
  }

  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    const response = await this.client.get<LowStockAlert[]>('/inventory/low-stock');
    return response.data;
  }

  async adjustStock(itemId: number, adjustmentData: {
    adjustmentType: 'add' | 'subtract' | 'set';
    quantity: number;
    reason?: string;
  }): Promise<InventoryItem> {
    const response = await this.client.post<InventoryItem>(`/inventory/${itemId}/adjust`, adjustmentData);
    return response.data;
  }

  // Employee Orders API
  async getOrders(filters?: {
    status?: string;
    orderType?: string;
    date?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    orders: Order[];
    totalOrders: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.orderType) params.append('orderType', filters.orderType);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const response = await this.client.get(`/order?${params}`);
    return response.data;
  }

//manager create menu API routes.
  async createMenuItem(itemData: {
  menuId: number;
  itemName: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  prepTimeMinutes?: number;
}): Promise<MenuItem> {
  const response = await this.client.post<MenuItem>('/menu/items', itemData);
  return response.data;
}

async updateMenuItem(menuItemId: number, itemData: {
  itemName: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  prepTimeMinutes?: number;
}): Promise<void> {
  await this.client.put(`/menu/items/${menuItemId}`, itemData);
}

async updateMenuItemAvailability(menuItemId: number, isAvailable: boolean): Promise<void> {
  await this.client.patch(`/menu/items/${menuItemId}/availability`, { isAvailable });
}

async deleteMenuItem(menuItemId: number): Promise<void> {
  await this.client.delete(`/menu/items/${menuItemId}`);
}

async createMenu(menuData: {
  menuName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}): Promise<Menu> {
  const response = await this.client.post<Menu>('/menu', menuData);
  return response.data;
}

async updateMenu(menuId: number, menuData: {
  menuName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}): Promise<void> {
  await this.client.put(`/menu/${menuId}`, menuData);
}

// Delete menu
async deleteMenu(menuId: number): Promise<void> {
  await this.client.delete(`/menu/${menuId}`);
}

//sales analytics 

async getSalesAnalytics(days: number = 7): Promise<{
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: Array<{
    date: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }>;
}> {
  const response = await this.client.get(`/analytics/sales-data?days=${days}`);
  return response.data;
}

async getPopularItems(days: number = 30): Promise<Array<{
  menuItemId: number;
  menuItemName: string;
  timesOrdered: number;
  revenue: number;
}>> {
  const response = await this.client.get(`/analytics/popular-items?days=${days}`);
  return response.data;
}

async getCustomerAnalytics(days: number = 30): Promise<{
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
}> {
  const response = await this.client.get(`/analytics/customer-analytics?days=${days}`);
  return response.data;
}

async getOrderDistribution(days: number = 30): Promise<{
  totalOrders: number;
  orderTypes: Array<{
    orderType: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
}> {
  const response = await this.client.get(`/analytics/order-distribution?days=${days}`);
  return response.data;
}

async getInventoryValuation(): Promise<{
  totalInventoryValue: number;
  totalItems: number;
  lowStockItems: number;
  overstockedItems: number;
  categoryBreakdown: Array<{
    category: string;
    totalValue: number;
    itemCount: number;
  }>;
  lastUpdated: string;
}> {
  const response = await this.client.get('/inventory/valuation');
  return response.data;
}


async createPaymentIntent(data: { orderId: number }): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}> {
  const response = await this.client.post('/payment/create-payment-intent', data);
  return response.data;
}

async confirmPayment(data: { paymentIntentId: string }): Promise<void> {
  await this.client.post('/payment/confirm-payment', data);
}


// Delivery methods
async getDeliveryQuote(data: {
  dropoffLatitude: number;
  dropoffLongitude: number;
  dropoffAddress: string;
}): Promise<{
  deliveryFee: number;
  estimatedDeliveryTime: number;
  currency: string;
  quoteId: string;
}> {
  const response = await this.client.post('/delivery/quote', data);
  return response.data;
}

async createDelivery(data: {
  orderId: number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  deliveryInstructions?: string;
}): Promise<{
  deliveryId: string;
  status: string;
  trackingUrl: string;
  estimatedDeliveryTime: number;
  deliveryFee: number;
}> {
  const response = await this.client.post('/delivery/create', data);
  return response.data;
}

async getDeliveryStatus(deliveryId: string): Promise<{
  deliveryId: string;
  status: string;
  trackingUrl: string;
  estimatedDeliveryTime: number;
  driverName?: string;
  driverPhone?: string;
  driverLocation?: { latitude: number; longitude: number };
}> {
  const response = await this.client.get(`/delivery/status/${deliveryId}`);
  return response.data;
}

async getDeliveryByOrder(orderId: number): Promise<{
  deliveryId: string;
  status: string;
  trackingUrl: string;
  estimatedDeliveryTime: number;
  driverName?: string;
  driverPhone?: string;
  driverLocation?: { latitude: number; longitude: number };
}> {
  const response = await this.client.get(`/delivery/order/${orderId}`);
  return response.data;
}

async cancelDelivery(deliveryId: string): Promise<{ success: boolean }> {
  const response = await this.client.delete(`/delivery/cancel/${deliveryId}`);
  return response.data;
}





}






export const apiClient = new ApiClient();
