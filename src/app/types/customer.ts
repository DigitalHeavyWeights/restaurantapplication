export interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registrationDate: string;
  isActive: boolean;
}

export interface CustomerFavorite {
  favoriteId: number;
  customerId: number;
  menuItemId: number;
  favoriteName?: string;
  dateAdded: string;
  menuItem: MenuItem;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteOrderType: string;
  lastOrderDate?: string;
  favoriteItems: FavoriteItemStats[];
}

export interface FavoriteItemStats {
  menuItemId: number;
  menuItemName: string;
  timesOrdered: number;
}