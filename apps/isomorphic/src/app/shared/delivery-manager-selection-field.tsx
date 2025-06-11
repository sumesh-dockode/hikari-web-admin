'use client';
import { DeliveryManagerDataType } from '@/data/delivery-manager-data';
import usePaginatedDeliveryManager from '@/hooks/DeliveryManager/usePaginatedDeliveryManager';
import React from 'react';
import { Select, SelectOption } from 'rizzui/select';

interface DeliveryManagerSelectionFieldProps {
  value?: number;
  onChange: (value: number) => void;
  onClear?: () => void;
  error?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  placeholder?: string;
}

const DeliveryManagerSelectionField = ({
  value,
  onChange,
  onClear,
  error,
  size = 'md',
  placeholder = 'Select Delivery Manager',
}: DeliveryManagerSelectionFieldProps) => {
  const { data: deliveryManagerData } = usePaginatedDeliveryManager({});
  const deliveryManagerOptions =
    deliveryManagerData?.data.map(
      (deliveryManager: DeliveryManagerDataType) => ({
        key: deliveryManager.id,
        label: `${deliveryManager.first_name || ''} ${deliveryManager.last_name || ''}`,
        value: deliveryManager.id,
      })
    ) || [];

  return (
    <Select
      className="w-full sm:min-w-[280px]"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      onClear={onClear}
      options={deliveryManagerOptions}
      searchable={true}
      stickySearch={true}
      clearable={!!onClear}
      getOptionValue={(option) => option.value}
      displayValue={(selected) =>
        deliveryManagerOptions?.find((o: SelectOption) => o.value === selected)
          ?.label || ''
      }
      error={error}
      size={size}
    />
  );
};

export default DeliveryManagerSelectionField;
