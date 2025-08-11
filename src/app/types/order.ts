export interface Order {
  orderId: number;
  customerId?: number;
  customerName: string;
  customerEmail?: string;
  employeeId: number;
  employeeName: string;
  orderDate: string;
  orderTime: string;
  orderType: 'dine-in' | 'takeout' | 'delivery' | 'online';
  orderStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  subtotal?: number;
  totalAmount: number;
  orderItems: OrderItem[];
  payments: Payment[];
}

export interface OrderItem {
  orderItemId: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  specialInstructions?: string;
}

export interface Payment {
  paymentId: number;
  paymentMethod: string;
  paymentAmount: number;
  paymentDate: string;
  transactionId?: string;
}

export interface CreateOrderRequest {
  customerId?: number;
  orderType: string;
  orderItems: CreateOrderItem[];
}

export interface CreateOrderItem {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface CartItem extends CreateOrderItem {
  menuItem: MenuItem;
  lineTotal: number;
}

// Kitchen-specific order interface
export interface KitchenOrder {
  orderId: number;
  customerName: string;
  orderDate: string;
  orderTime: string;
  orderType: 'dine-in' | 'takeout' | 'delivery' | 'online';
  orderStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  estimatedPrepTime: number;
  orderItems: KitchenOrderItem[];
}

export interface KitchenOrderItem {
  menuItemName: string;
  quantity: number;
  specialInstructions?: string;
}

// You'll need to import MenuItem from your menu types
interface MenuItem {
  menuItemId: number;
  menuId: number;
  itemName: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  prepTimeMinutes?: number;
}