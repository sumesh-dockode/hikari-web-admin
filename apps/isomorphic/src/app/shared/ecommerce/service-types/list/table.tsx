'use client';
import PageLoader from '@/app/shared/page-loader';
import { ServiceTypeDataType } from '@/data/service-types-data';
import { useDeleteServiceTypes } from '@/hooks/serviceTypes/useDeleteServiceTypes';
import usePaginatedServiceTypes from '@/hooks/serviceTypes/usePaginatedServiceTypes';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { PaginationState } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Table from '@core/components/table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { serviceTypesColumns } from './column';

interface FiltersProps {
  search?: string;
}

export default function ServiceTypesTable() {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });

  const { data, isLoading } = usePaginatedServiceTypes(pagination);
  const { mutate: deleteServiceTypes, status: deleteStatus } =
    useDeleteServiceTypes();
  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<ServiceTypeDataType>({
    tableData: [],
    columnConfig: serviceTypesColumns,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setDeleteItemId(row.id);
          deleteServiceTypes(row.id, {
            onSuccess: () => {
              toast.success('Service Type deleted successfully');
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
      const APIData = data?.data?.results || [];
      setData(APIData);
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
