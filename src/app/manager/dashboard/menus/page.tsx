'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Loading } from '../../../components/ui/Loading';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { 
  Plus, 
  Edit, 
  ToggleLeft, 
  ToggleRight,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { Menu } from '../../../types/menu';
import { apiClient } from '../../../lib/api';
import { useUIStore } from '../../../store/uiStore';

export default function MenuListPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    setIsLoading(true);
    try {
      const menuData = await apiClient.getMenus();
      setMenus(menuData);
    } catch (error) {
      console.error('Failed to load menus:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load menus'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (menu: Menu) => {
    try {
      const updateData = {
        menuName: menu.menuName,
        startDate: menu.startDate,
        endDate: menu.endDate,
        isActive: !menu.isActive
      };
      
      await apiClient.updateMenu(menu.menuId, updateData);
      setMenus(prevMenus =>
        prevMenus.map(m =>
          m.menuId === menu.menuId
            ? { ...m, isActive: !m.isActive }
            : m
        )
      );
      addToast({
        type: 'success',
        title: 'Updated',
        message: `${menu.menuName} is now ${!menu.isActive ? 'active' : 'inactive'}`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update menu status'
      });
    }
  };

  const handleDeleteMenu = async (menu: Menu) => {
    if (!confirm(`Are you sure you want to delete "${menu.menuName}"?`)) return;

    try {
      await apiClient.deleteMenu(menu.menuId);
      setMenus(prevMenus =>
        prevMenus.filter(m => m.menuId !== menu.menuId)
      );
      addToast({
        type: 'success',
        title: 'Deleted',
        message: `${menu.menuName} has been deleted`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete menu'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading menus..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['Manager']}>
      <div className="pb-28">
        <Header 
          title="Menu Management" 
          showBack
          actions={
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/manager/dashboard/menus/create')}
              className="px-2 py-1 text-xs h-7"
            >
              <Plus className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Add Menu</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        />
        
        <div className="p-4 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center" padding="sm">
              <div className="text-lg font-bold text-neutral-900">{menus.length}</div>
              <div className="text-xs text-neutral-600">Total Menus</div>
            </Card>
            <Card className="text-center" padding="sm">
              <div className="text-lg font-bold text-green-600">
                {menus.filter(m => m.isActive).length}
              </div>
              <div className="text-xs text-neutral-600">Active</div>
            </Card>
          </div>

          {/* Menu List */}
          {menus.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Menus Found</h3>
              <p className="text-neutral-600 mb-6">
                Start by creating your first menu
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/manager/dashboard/menus/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {menus.map((menu) => (
                <Card key={menu.menuId} padding="md">
                  <div className="flex items-start space-x-4">
                    {/* Menu Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📋</span>
                    </div>

                    {/* Menu Details */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Badge Row */}
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 text-base truncate">
                            {menu.menuName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(menu.startDate)}</span>
                            </div>
                            {menu.endDate && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Until {formatDate(menu.endDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={menu.isActive ? 'success' : 'danger'}
                          size="sm"
                          className="flex-shrink-0"
                        >
                          {menu.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center justify-end gap-2">
                        {/* Active Toggle */}
                        <button
                          onClick={() => handleToggleActive(menu)}
                          className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors"
                          title={menu.isActive ? 'Mark as inactive' : 'Mark as active'}
                        >
                          {menu.isActive ? (
                            <ToggleRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/manager/dashboard/menus/${menu.menuId}/edit`)}
                          className="p-1.5 min-w-0"
                          title="Edit menu"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMenu(menu)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 min-w-0"
                          title="Delete menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/manager/dashboard/menus/create')}
                className="h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Menu
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}