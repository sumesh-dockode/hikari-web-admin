'use client';
import { StoreManagerDataType } from '@/data/store-manager-data';
import usePaginatedStoreManager from '@/hooks/storeManager/usePaginatedStoreManager';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { Select, SelectOption } from 'rizzui/select';

interface StoreManagerSelectionFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

const StoreManagerSelectionField = ({
  value,
  onChange,
  error,
}: StoreManagerSelectionFieldProps) => {
  const [searchText, setSearchText] = useState('');
  const { data: storeManagerData } = usePaginatedStoreManager({
    search: searchText,
  });
  const storeManagerOptions =
    storeManagerData?.data.map((storeManager: StoreManagerDataType) => ({
      key: storeManager.id,
      label: `${storeManager.first_name || ''} ${storeManager.last_name || ''}`,
      value: storeManager.id,
    })) || [];

  //   const onSearchChange = debounce((value: string) => {
  //     setSearchText(value);
  //   }, 500);

  return (
    <Select
      className="w-full sm:max-w-[280px]"
      placeholder="Select Store Manager"
      value={value ?? ''}
      onChange={onChange}
      //   onSearchChange={onSearchChange}
      options={storeManagerOptions}
      searchable={true}
      stickySearch={true}
      getOptionValue={(option) => option.value}
      displayValue={(selected) =>
        storeManagerOptions?.find((o: SelectOption) => o.value === selected)
          ?.label || ''
      }
      error={error}
    />
  );
};

export default StoreManagerSelectionField;
