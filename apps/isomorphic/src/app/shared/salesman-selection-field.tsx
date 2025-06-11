'use client';
import { SalesmanDataType } from '@/data/salesman-data';
import usePaginatedSalesMan from '@/hooks/sales/salesman/usePaginatedSalesMan';
import React from 'react';
import { Select, SelectOption } from 'rizzui/select';

interface SalesmanSelectionFieldProps {
  value?: number;
  onChange: (value: number) => void;
  onClear?: () => void;
  error?: string;
}

const SalesmanSelectionField = ({
  value,
  onChange,
  onClear,
  error,
}: SalesmanSelectionFieldProps) => {
  const { data: salesmanData } = usePaginatedSalesMan({});
  const salesManOptions =
    salesmanData?.data.map((salesman: SalesmanDataType) => ({
      key: salesman.id,
      label: `${salesman.first_name || ''} ${salesman.last_name || ''}`,
      value: salesman.id,
    })) || [];

  return (
    <Select
      className="w-full sm:max-w-[280px]"
      placeholder="Select Salesman"
      value={value ?? ''}
      onChange={onChange}
      onClear={onClear}
      options={salesManOptions}
      searchable={true}
      stickySearch={true}
      clearable={!!onClear}
      getOptionValue={(option) => option.value}
      displayValue={(selected) =>
        salesManOptions?.find((o: SelectOption) => o.value === selected)
          ?.label || ''
      }
      error={error}
    />
  );
};

export default SalesmanSelectionField;
