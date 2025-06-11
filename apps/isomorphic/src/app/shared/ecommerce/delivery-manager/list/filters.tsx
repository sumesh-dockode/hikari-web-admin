'use client';

import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState } from 'react';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Flex, Input } from 'rizzui';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  handleSearchChange: (search: string) => void;
  searchText?: string;
}

export default function Filters<TData extends Record<string, any>>({
  table,
  handleSearchChange,
  searchText,
}: TableToolbarProps<TData>) {
  const [searchTerm, setSearchTerm] = useState(searchText);

  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by delivery manager name..."
        value={searchTerm || ''}
        onClear={() => {
          setSearchTerm('');
          handleSearchChange('');
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearchChange(e.target.value);
        }}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
        autoFocus
      />

      <ToggleColumns table={table} />
    </Flex>
  );
}
