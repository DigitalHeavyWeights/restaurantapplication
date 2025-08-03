import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface OrderTimerProps {
  orderTime: string;
  estimatedPrepTime?: number;
  className?: string;
}

export const OrderTimer: React.FC<OrderTimerProps> = ({
  orderTime,
  estimatedPrepTime = 0,
  className = ''
}) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const orderDate = new Date(`2000-01-01T${orderTime}`);
      const now = new Date();
      const currentTime = new Date(`2000-01-01T${now.toTimeString().split(' ')[0]}`);
      const diffMs = currentTime.getTime() - orderDate.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      setElapsedMinutes(Math.max(0, diffMins));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [orderTime]);

  const isOverdue = estimatedPrepTime > 0 && elapsedMinutes > estimatedPrepTime;
  const remainingMinutes = estimatedPrepTime > 0 ? estimatedPrepTime - elapsedMinutes : 0;

  const getTimerColor = () => {
    if (!estimatedPrepTime) return 'text-neutral-600';
    if (isOverdue) return 'text-red-600';
    if (remainingMinutes <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDisplayText = () => {
    if (!estimatedPrepTime) {
      return `${elapsedMinutes}m elapsed`;
    }
    
    if (isOverdue) {
      return `${elapsedMinutes - estimatedPrepTime}m overdue`;
    }
    
    return `${remainingMinutes}m remaining`;
  };

  return (
    <div className={`flex items-center space-x-1 ${getTimerColor()} ${className}`}>
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">{getDisplayText()}</span>
    </div>
  );
};