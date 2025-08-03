export interface InventoryItem {
  inventoryId: number;
  ingredientId: number;
  ingredientName: string;
  unitOfMeasure: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  lastUpdated: string;
  location?: string;
  stockStatus: 'Good' | 'Warning' | 'Low';
  costPerUnit?: number;
  stockValue: number;
  allergenInfo?: string;
}

export interface LowStockAlert {
  inventoryId: number;
  ingredientName: string;
  currentStock: number;
  minimumStock: number;
  unitOfMeasure: string;
  location?: string;
  supplierName?: string;
  daysUntilStockOut: number;
  suggestedOrderQuantity: number;
}

