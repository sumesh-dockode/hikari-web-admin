'use client';

import { FilterDrawerView } from '@core/components/controlled-table/table-filter';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState } from 'react';
import { PiFunnel, PiMagnifyingGlassBold } from 'react-icons/pi';
import { Button, Flex, Input } from 'rizzui';
import CategorySelectionField from '@/app/shared/category-selection-field';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  handleSearchChange?: (search: string) => void;
  searchText?: string;
  handleFilters?: (filters: any) => void;
  category?: number;
}

interface FilterElementProps {
  categories?: number;
  setCategories: (value?: number) => void;
}

export default function Filters<TData extends Record<string, any>>({
  table,
  handleSearchChange,
  searchText,
  handleFilters,
  category,
}: TableToolbarProps<TData>) {
  const [searchTerm, setSearchTerm] = useState(searchText);
  const [categories, setCategories] = useState(category);

  const [openDrawer, setOpenDrawer] = useState(false);
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;

  const {
    options: { meta },
  } = table;

  const applyFilter = async () => {
    handleFilters && handleFilters({ category: categories });
    setOpenDrawer(false);
  };

  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by product name..."
        value={searchTerm || ''}
        onClear={() => {
          setSearchTerm('');
          handleSearchChange && handleSearchChange('');
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearchChange && handleSearchChange(e.target.value);
        }}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
        autoFocus
      />

      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle="Table Filters"
        setOpenDrawer={setOpenDrawer}
        applyFilter={applyFilter}
      >
        <div className="grid grid-cols-1 gap-6">
          <FilterElements
            setCategories={setCategories}
            categories={categories}
          />
        </div>
      </FilterDrawerView>

      <Flex align="center" gap="3" className="w-auto">       
      </Flex>
    </Flex>
  );
}

function FilterElements({ categories, setCategories }: FilterElementProps) {
  return (
    <>
      <CategorySelectionField
        value={categories}
        onChange={setCategories}
        onClear={() => setCategories(undefined)}
      />
    </>
  );
}
