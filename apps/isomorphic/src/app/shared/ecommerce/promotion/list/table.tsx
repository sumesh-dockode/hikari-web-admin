'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import { PromotionColumn } from './columns';
import PromotionModal from '../../product/create-edit/promotion-modal';
import { PaginationState } from '@tanstack/react-table';
import { PromotionDataType } from '@/data/promotion-data';
import usePaginatedPromotions from '@/hooks/promotions/usePaginatedPromotion';
import { useDeletePromotion } from '@/hooks/promotions/useDeletePromotion';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import PageLoader from '../../../page-loader';
import Filters from './filters';
import usePaginatedStoreManager from '@/hooks/storeManager/usePaginatedStoreManager';

interface FiltersProps {
  search?: string;
}
export interface StoreManagerListProps {
  first_name: string;
  last_name: string;
  id: number;
}

export default function PromotionsTable() {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState & FiltersProps>({
    pageIndex: 0,
    pageSize: 10,
    search: '',
  });
  const { data: storeManagerData } = usePaginatedStoreManager({});
  const { data, isLoading } = usePaginatedPromotions(pagination);
  const { mutate: deletePromotion, status: deleteStatus } =
    useDeletePromotion();
  const pageCount = data?.data?.total_pages || 1;

  const { table, setData } = useTanStackTable<PromotionDataType>({
    tableData: [],
    columnConfig: PromotionColumn,
    options: {
      meta: {
        handleDeleteRow: (row) => {
          setDeleteItemId(row.id);
          deletePromotion(row.id, {
            onSuccess: () => {
              toast.success('Promotion deleted successfully');
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
    if (data && storeManagerData) {
      const storeManagersList = storeManagerData?.data?.map(
        (i: StoreManagerListProps) => ({
          name: `${i.first_name || ''} ${i.last_name || ''}`,
          id: i.id,
        })
      );

      const promotionAPIData =
        data?.data?.results?.map((i: PromotionDataType) => ({
          ...i,
          store_manager:
            storeManagersList?.find(
              (j: StoreManagerListProps) => j.id === i.store_manager
            )?.name || '',
        })) || [];
      setData(promotionAPIData);
    }
  }, [data, storeManagerData]);

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
          rowClassName: 'last:border-0 cursor-pointer',
        }}
      />

      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
