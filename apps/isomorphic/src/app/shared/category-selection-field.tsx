'use client';
import { CategoryDataType } from '@/data/product-categories';
import usePaginatedCategories from '@/hooks/categories/usePaginatedCategories';
import React from 'react';
import { Select, SelectOption } from 'rizzui/select';

interface CategorySelectionFieldProps {
  value?: number;
  onChange: (value: number) => void;
  onClear?: () => void;
  error?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  placeholder?: string;
}

const CategorySelectionField = ({
  value,
  onChange,
  onClear,
  error,
  size = 'md',
  placeholder = 'Select Category',
}: CategorySelectionFieldProps) => {
  const { data: categoryData } = usePaginatedCategories({});
  const categoryOptions =
    categoryData?.data.map((category: CategoryDataType) => ({
      key: category.id,
      label: category.name,
      value: category.id,
    })) || [];

  return (
    <Select
      className="w-full sm:min-w-[280px]"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      onClear={onClear}
      options={categoryOptions}
      searchable={true}
      stickySearch={true}
      clearable={!!onClear}
      getOptionValue={(option) => option.value}
      displayValue={(selected) =>
        categoryOptions?.find((o: SelectOption) => o.value === selected)
          ?.label || ''
      }
      error={error}
      size={size}
    />
  );
};

export default CategorySelectionField;
