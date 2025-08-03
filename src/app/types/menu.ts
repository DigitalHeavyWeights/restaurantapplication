export interface Menu {
  menuId: number;
  menuName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface MenuItem {
  menuItemId: number;
  menuId: number;
  itemName: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  prepTimeMinutes?: number;
}

export interface MenuItemDetail extends MenuItem {
  ingredients: Ingredient[];
}

export interface Ingredient {
  ingredientId: number;
  ingredientName: string;
  quantityNeeded: number;
  isOptional: boolean;
  allergenInfo?: string;
}