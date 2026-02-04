'use client';

import { FilterDrawerView } from '@core/components/controlled-table/table-filter';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { PiFunnel, PiMagnifyingGlassBold } from 'react-icons/pi';
import { Button, Flex, Input } from 'rizzui';
import CategorySelectionField from '@/app/shared/category-selection-field';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
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

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    // Reset page to 1 when searching
    params.delete('page');
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only trigger if searchTerm is different from URL param to avoid initial double fetch or loops
      // But we just initialized searchTerm from URL, so it should be fine.
      // We also want to avoid triggering if it hasn't changed.
      const currentSearch = searchParams.get('search') || '';
      if (searchTerm !== currentSearch) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by product name..."
        value={searchTerm}
        onClear={() => {
          setSearchTerm('');
          handleSearch('');
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(searchTerm);
          }
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
