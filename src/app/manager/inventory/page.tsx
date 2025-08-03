'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { Modal } from '../../components/ui/Modal';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Search, 
  Plus, 
  Minus,
  Edit,
  RefreshCw 
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useUIStore } from '../../store/uiStore';

interface InventoryItem {
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

interface LowStockAlert {
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

export default function ManagerInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'add' as 'add' | 'subtract' | 'set',
    quantity: 0,
    reason: ''
  });
  const { addToast } = useUIStore();

  useEffect(() => {
    loadInventoryData();
  }, [showLowStockOnly, locationFilter, searchQuery]);

  const loadInventoryData = async () => {
    setIsLoading(true);
    try {
      const [inventoryData, alertsData] = await Promise.all([
        apiClient.getInventory({
          lowStockOnly: showLowStockOnly,
          location: locationFilter || undefined,
          search: searchQuery || undefined
        }),
        apiClient.getLowStockAlerts()
      ]);
      
      setInventory(inventoryData);
      setLowStockAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load inventory data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockAdjustment = async () => {
    if (!selectedItem) return;

    try {
      await apiClient.adjustStock(selectedItem.inventoryId, {
        adjustmentType: adjustmentData.type,
        quantity: adjustmentData.quantity,
        reason: adjustmentData.reason
      });

      addToast({
        type: 'success',
        title: 'Stock Updated',
        message: `${selectedItem.ingredientName} stock adjusted successfully`
      });

      setAdjustmentModal(false);
      setSelectedItem(null);
      setAdjustmentData({ type: 'add', quantity: 0, reason: '' });
      loadInventoryData();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update stock levels'
      });
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'success';
      case 'Warning': return 'warning';
      case 'Low': return 'danger';
      default: return 'neutral';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.ingredientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === '' || 
      (item.location && item.location.toLowerCase().includes(locationFilter.toLowerCase()));
    return matchesSearch && matchesLocation;
  });

  if (isLoading) {
    return <Loading fullScreen text="Loading inventory..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Inventory Management" 
          showNotifications
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={loadInventoryData}
              className="p-2"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          }
        />
        
        <div className="p-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="text-center bg-blue-50 border-blue-200">
              <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-blue-600">Total Items</p>
              <p className="text-2xl font-bold text-blue-900">{inventory.length}</p>
            </Card>
            
            <Card className="text-center bg-red-50 border-red-200">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-900">{lowStockAlerts.length}</p>
            </Card>
            
            <Card className="text-center bg-green-50 border-green-200">
              <TrendingDown className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-600">Total Value</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(inventory.reduce((sum, item) => sum + item.stockValue, 0))}
              </p>
            </Card>
          </div>

          {/* Low Stock Alerts */}
          {lowStockAlerts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-900">Low Stock Alerts</h3>
              </div>
              <div className="space-y-2">
                {lowStockAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.inventoryId} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{alert.ingredientName}</p>
                      <p className="text-sm text-red-600">
                        {alert.currentStock} {alert.unitOfMeasure} remaining (min: {alert.minimumStock})
                      </p>
                    </div>
                    <Badge variant="danger" size="sm">
                      {alert.daysUntilStockOut} days left
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  className="flex-1"
                />
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-48"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm">Show low stock only</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Inventory List */}
          {filteredInventory.length === 0 ? (
            <Card className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Inventory Found</h3>
              <p className="text-neutral-600">
                {searchQuery || locationFilter 
                  ? 'Try adjusting your search filters' 
                  : 'No inventory items have been added yet'}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredInventory.map((item) => (
                <Card key={item.inventoryId} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-neutral-900">{item.ingredientName}</h3>
                        <Badge variant={getStockStatusColor(item.stockStatus)} size="sm">
                          {item.stockStatus}
                        </Badge>
                        {item.location && (
                          <Badge variant="secondary" size="sm">{item.location}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-600">Current Stock</p>
                          <p className="font-medium">
                            {item.currentStock} {item.unitOfMeasure}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Min Stock</p>
                          <p className="font-medium">
                            {item.minimumStock} {item.unitOfMeasure}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Value</p>
                          <p className="font-medium">{formatCurrency(item.stockValue)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Last Updated</p>
                          <p className="font-medium">{formatDate(item.lastUpdated)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setAdjustmentModal(true);
                        }}
                        className="px-3"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Adjust
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stock Adjustment Modal */}
        <Modal
          isOpen={adjustmentModal}
          onClose={() => {
            setAdjustmentModal(false);
            setSelectedItem(null);
          }}
          title="Adjust Stock"
        >
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-neutral-900 mb-1">
                  {selectedItem.ingredientName}
                </h4>
                <p className="text-sm text-neutral-600">
                  Current stock: {selectedItem.currentStock} {selectedItem.unitOfMeasure}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'add', label: 'Add', icon: Plus },
                    { value: 'subtract', label: 'Remove', icon: Minus },
                    { value: 'set', label: 'Set To', icon: Edit }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setAdjustmentData({...adjustmentData, type: type.value as any})}
                        className={`flex items-center justify-center space-x-1 p-2 rounded-lg border-2 transition-colors ${
                          adjustmentData.type === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                label="Quantity"
                type="number"
                min="0"
                step="0.01"
                value={adjustmentData.quantity}
                onChange={(e) => setAdjustmentData({...adjustmentData, quantity: Number(e.target.value)})}
                placeholder="Enter quantity"
              />

              <Input
                label="Reason (Optional)"
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
                placeholder="Reason for adjustment"
              />

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdjustmentModal(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleStockAdjustment}
                  disabled={adjustmentData.quantity <= 0}
                  className="flex-1"
                >
                  Update Stock
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}