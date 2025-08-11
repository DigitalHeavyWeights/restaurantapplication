import React from 'react';
import { Badge } from '../../components/ui/Badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const allCategories = ['all', ...categories];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          {category === 'all' ? 'All Items' : category}
        </button>
      ))}
    </div>
  );
};