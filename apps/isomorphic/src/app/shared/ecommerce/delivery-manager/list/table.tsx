'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { DeliveryManagerColumns } from './columns';
import { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { DeliveryManagerDataType } from '@/data/delivery-manager-data';
import usePaginatedDeliveryManager from '@/hooks/DeliveryManager/usePaginatedDeliveryManager';
import { useDeleteDeliveryManager } from '@/hooks/DeliveryManager/useDeleteDeliveryManager';
import toast from 'react-hot-toast';
import PageLoader from '@/app/shared/page-loader';
import { debounce } from 'lodash';

interface FiltersProps {
  search?: string;
}

export default function DeliveryManagerTable() {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });
  const { data, isLoading } = usePaginatedDeliveryManager(pagination);
  const { mutate: deleteDeliveryManager, status: deleteStatus } =
    useDeleteDeliveryManager();
  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<DeliveryManagerDataType>({
    tableData: [],
    columnConfig: DeliveryManagerColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setDeleteItemId(row.id);
          deleteDeliveryManager(row.id, {
            onSuccess: () => {
              toast.success('Delivery Manager deleted successfully');
            },
          });
        },
        deleteId: deleteItemId,
        isDeleting: deleteStatus === 'pending',
      },
      enableColumnResizing: false,
      manualPagination: true,
      pageCount: pageCount as number,
      onPaginationChange: (updater) => {
        const nextPagination =
          typeof updater === 'function' ? updater(pagination) : updater;

        setPagination(nextPagination);
      },
    },
    pagination,
  });

  useEffect(() => {
    if (data) {
      const deliveryManagerAPIData = data?.data?.results || [];
      setData(deliveryManagerAPIData);
    }
  }, [data]);

  const handleSearchChange = debounce((value: string) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
      pageIndex: 0,
    }));
  }, 500);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Filters
        table={table}
        handleSearchChange={handleSearchChange}
        searchText={pagination.search}
      />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
