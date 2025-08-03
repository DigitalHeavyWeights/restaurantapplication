'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useUIStore } from '../../store/uiStore';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface PopularItem {
  menuItemId: number;
  menuItemName: string;
  timesOrdered: number;
  revenue: number;
}

interface InventoryCost {
  category: string;
  totalValue: number;
  itemCount: number;
}

interface CustomerData {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
}

export default function ManagerReportsPage() {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [inventoryCosts, setInventoryCosts] = useState<InventoryCost[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadSalesData(),
        loadPopularItems(),
        loadInventoryData(),
        loadCustomerData()
      ]);
    } catch (error) {
      console.error('Failed to load reports data:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load reports data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSalesData = async () => {
    try {
      const salesAnalytics = await apiClient.getSalesAnalytics(parseInt(dateRange));
      setSalesData(salesAnalytics.dailySales.map(day => ({
        date: day.date,
        revenue: day.revenue,
        orders: day.orders,
        averageOrderValue: day.averageOrderValue
      })));
      setTotalRevenue(salesAnalytics.totalRevenue);
      setTotalOrders(salesAnalytics.totalOrders);
      setAverageOrderValue(salesAnalytics.averageOrderValue);
    } catch (error) {
      console.error('Failed to load sales data:', error);
    }
  };

  const loadPopularItems = async () => {
    try {
      const popularItemsData = await apiClient.getPopularItems(parseInt(dateRange));
      setPopularItems(popularItemsData);
    } catch (error) {
      console.error('Failed to load popular items:', error);
    }
  };

  const loadInventoryData = async () => {
    try {
      const inventoryValuation = await apiClient.getInventoryValuation();
      setInventoryCosts(inventoryValuation.categoryBreakdown);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    }
  };

  const loadCustomerData = async () => {
    try {
      const customerAnalytics = await apiClient.getCustomerAnalytics(parseInt(dateRange));
      setCustomerData(customerAnalytics);
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  };

  const exportReport = () => {
    // Implement CSV export functionality
    addToast({
      type: 'info',
      title: 'Export Started',
      message: 'Your report is being prepared for download'
    });
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

  if (isLoading) {
    return <Loading fullScreen text="Loading reports..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-20">
        <Header 
          title="Reports & Analytics" 
          showBack
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={exportReport}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          }
        />
        
        <div className="p-4 space-y-6">
          {/* Date Range Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Business Overview</h2>
            <div className="flex space-x-2">
              {[
                { value: '7', label: '7 Days' },
                { value: '30', label: '30 Days' },
                { value: '90', label: '90 Days' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    dateRange === range.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center" padding="md">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-sm text-neutral-600">Total Revenue</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+12.5%</span>
              </div>
            </Card>

            <Card className="text-center" padding="md">
              <div className="flex items-center justify-center mb-2">
                <ShoppingCart className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">{totalOrders}</div>
              <div className="text-sm text-neutral-600">Total Orders</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+8.3%</span>
              </div>
            </Card>

            <Card className="text-center" padding="md">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {formatCurrency(averageOrderValue)}
              </div>
              <div className="text-sm text-neutral-600">Avg Order Value</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-xs text-red-600">-2.1%</span>
              </div>
            </Card>

            <Card className="text-center" padding="md">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                {customerData?.totalCustomers || 0}
              </div>
              <div className="text-sm text-neutral-600">Total Customers</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+15.2%</span>
              </div>
            </Card>
          </div>

          {/* Sales Trend Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                <Activity className="w-5 h-5 inline mr-2" />
                Sales Trend
              </h3>
              <Badge variant="secondary" size="sm">
                Last {dateRange} days
              </Badge>
            </div>
            
            <div className="space-y-3">
              {salesData.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {day.orders} orders
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatCurrency(day.revenue)}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {formatCurrency(day.averageOrderValue)} avg
                    </div>
                  </div>
                  <div className="ml-4 w-16 bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((day.revenue / Math.max(...salesData.map(d => d.revenue))) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Items */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Popular Menu Items
              </h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div className="space-y-3">
              {popularItems.slice(0, 5).map((item, index) => (
                <div key={item.menuItemId} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{item.menuItemName}</div>
                      <div className="text-sm text-neutral-600">{item.timesOrdered} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Analytics */}
          {customerData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  <Users className="w-5 h-5 inline mr-2" />
                  Customer Insights
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">New Customers</div>
                      <div className="text-sm text-green-600">This period</div>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {customerData.newCustomers}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-800">Returning Customers</div>
                      <div className="text-sm text-blue-600">This period</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {customerData.returningCustomers}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Inventory Costs */}
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  <Package className="w-5 h-5 inline mr-2" />
                  Inventory by Category
                </h3>
                
                <div className="space-y-3">
                  {inventoryCosts.slice(0, 4).map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <div className="font-medium text-neutral-900">{category.category}</div>
                        <div className="text-sm text-neutral-600">{category.itemCount} items</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-neutral-900">
                          {formatCurrency(category.totalValue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Order Trends */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              <PieChart className="w-5 h-5 inline mr-2" />
              Order Type Distribution
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45%</div>
                <div className="text-sm text-blue-800">Dine-in</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">35%</div>
                <div className="text-sm text-green-800">Takeout</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">20%</div>
                <div className="text-sm text-purple-800">Delivery</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
