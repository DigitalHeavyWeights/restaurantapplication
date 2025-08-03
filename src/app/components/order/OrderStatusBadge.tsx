import React from 'react';
import { Clock, ChefHat, CheckCircle, XCircle, Package } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface OrderStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  showIcon = true,
  size = 'md'
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          variant: 'warning' as const,
          icon: Clock,
          label: 'Pending'
        };
      case 'preparing':
        return {
          variant: 'primary' as const,
          icon: ChefHat,
          label: 'Preparing'
        };
      case 'ready':
        return {
          variant: 'success' as const,
          icon: Package,
          label: 'Ready'
        };
      case 'completed':
        return {
          variant: 'neutral' as const,
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'cancelled':
        return {
          variant: 'danger' as const,
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          variant: 'neutral' as const,
          icon: Clock,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} size={size}>
      <div className="flex items-center space-x-1">
        {showIcon && <Icon className="w-3 h-3" />}
        <span>{config.label}</span>
      </div>
    </Badge>
  );
};