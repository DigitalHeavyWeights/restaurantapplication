export interface KitchenOrder {
  orderId: number;
  customerName: string;
  orderType: string;
  orderTime: string;
  orderStatus: string;
  estimatedPrepTime: number;
  orderItems: KitchenOrderItem[];
}

export interface KitchenOrderItem {
  menuItemName: string;
  quantity: number;
  specialInstructions?: string;
}