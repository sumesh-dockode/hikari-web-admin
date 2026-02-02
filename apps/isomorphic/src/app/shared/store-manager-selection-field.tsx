'use client';
import { StoreManagerDataType } from '@/data/store-manager-data';
import usePaginatedStoreManager from '@/hooks/storeManager/usePaginatedStoreManager';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { Select, SelectOption } from 'rizzui/select';

interface StoreManagerSelectionFieldProps {
  value: number;
  onChange: (
    value: number, 
    managerName?: string, 
    storeInfo?: { id: string; name: string }
  ) => void;
  error?: string;
  placeholder?: string;
}

const StoreManagerSelectionField = ({
  value,
  onChange,
  error,
  placeholder = "Select Store OMS",
}: StoreManagerSelectionFieldProps) => {
  const [searchText, setSearchText] = useState('');
  const { data: storeManagerData } = usePaginatedStoreManager({
    search: searchText,
  });
  
  // Log the API response to debug
  console.log('Store OMS API Response:', storeManagerData);
  
  const storeManagerOptions =
    storeManagerData?.data.map((storeManager: StoreManagerDataType) => ({
      key: storeManager.id,
      label: `${storeManager.store_info?.name ?? storeManager.first_name}`,
      value: storeManager.id,
      // Store the full manager data for later use
      managerData: storeManager,
    })) || [];

  return (
    <Select
      className="w-full sm:max-w-[280px]"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(selectedValue) => {
       
        const selectedOption = storeManagerOptions.find(
          (option: SelectOption) => option.value === selectedValue
        );
        
        if (selectedOption) {
          const managerData = selectedOption.managerData;
          
        
          console.log('Selected manager full data:', JSON.stringify(managerData, null, 2));
          
          const managerName = selectedOption.label;
          
         
          const storeInfo = managerData?.store_info 
            ? { 
                id: managerData.store_info.id, 
                name: managerData.store_info.name 
              } 
            : undefined;
          
       
          console.log('Passing to parent:', { 
            managerId: Number(selectedValue), 
            managerName, 
            storeInfo 
          });
          
         
          onChange(Number(selectedValue), managerName, storeInfo);
        } else {
        
          onChange(Number(selectedValue));
        }
      }}
      options={storeManagerOptions}
      searchable={true}
      stickySearch={true}
      getOptionValue={(option: SelectOption) => option.value}
      displayValue={(selected) =>
        storeManagerOptions?.find((o: SelectOption) => o.value === selected)
          ?.label || ''
      }
      error={error}
    />
  );
};

export default StoreManagerSelectionField;
