import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  border = true,
  onClick
}) => {
  const baseClasses = 'bg-white  transition-all duration-200';
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl'
  };

  return (
    <div
      className={clsx(
        baseClasses,
        paddings[padding],
        shadows[shadow],
        border && 'border border-neutral-200',
        onClick && 'cursor-pointer active:scale-95',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};