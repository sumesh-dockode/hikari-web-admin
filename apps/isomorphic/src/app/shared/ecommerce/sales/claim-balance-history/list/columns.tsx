'use client';

import DeletePopover from '@core/components/delete-popover';
import ConfirmationPopover from '@core/components/confirmation-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Flex, Text } from 'rizzui';
import { ClaimBalanceHistoryDataType } from './table';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { useApproveClaimBalance } from '@/hooks/sales/claimBalance/useApproveClaimBalance';

const columnHelper = createColumnHelper<ClaimBalanceHistoryDataType>();


function ActionCell({ row }: { row: any }) {
  const { mutate: approveClaimBalance, isPending } = useApproveClaimBalance();
  
  const handleApprove = (data: ClaimBalanceHistoryDataType) => {
    approveClaimBalance(data.id.toString());
  };
  
  const isApproved = row.original.status === 'Approved' || 
                     row.original.status === 'approved' || 
                     row.original.status === 'completed';
  
  return (
    <Flex align="center" justify="end" gap="3" className="pe-4">
      {!isApproved && (
        <ConfirmationPopover
          title="Approve Claim"
          description="Are you sure you want to approve this claim?"
          onConfirm={() => handleApprove(row.original)}
          isLoading={isPending}
        />
      )}
    </Flex>
  );
}

export const ClaimBalanceHistoryColumns = [
  // columnHelper.display({
  //   id: 'select',
  //   size: 50,
  //   header: ({ table }) => (
  //     <Checkbox
  //       className="ps-3.5"
  //       aria-label="Select all rows"
  //       checked={table.getIsAllPageRowsSelected()}
  //       onChange={() => table.toggleAllPageRowsSelected()}
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       className="ps-3.5"
  //       aria-label="Select row"
  //       checked={row.getIsSelected()}
  //       onChange={() => row.toggleSelected()}
  //     />
  //   ),
  // }),
  columnHelper.accessor('date', {
    id: 'date',
    size: 200,
    header: 'Date',
    cell: ({ row }) => <Text className="text-sm">{row.original.date}</Text>,
  }),
  columnHelper.accessor('claimed_by', {
    id: 'claimed_by',
    size: 300,
    header: 'Claimed By',
    cell: ({ row }) => (
      <Text className="text-sm">{row.original.claimed_by}</Text>
    ),
  }),

 columnHelper.accessor('redeem_info', {
  id: 'redeem_info',
  size: 200,
  header: 'Redeem Info',
  cell: ({ row }) => {
    const info = row.original.redeem_info;
    
   
    if (!info || typeof info !== 'object') {
      return <Text className="text-sm">-</Text>;
    }
    
   
    if (info.upi_id) {
      return (
        <div className="space-y-0.5 text-sm text-gray-700">
          <div> {info.upi_id}</div>
        </div>
      );
    }
    
    
    if (info.account_number || info.bank_name) {
      return (
        <div className="space-y-0.5 text-sm text-gray-700">
          {info.account_holder_name && <div>{info.account_holder_name}</div>}
          {info.bank_name && <div>{info.bank_name}</div>}
          {info.account_number && <div> {info.account_number}</div>}
          {info.ifsc_code && <div> {info.ifsc_code}</div>}
          {info.branch_name && <div>{info.branch_name}</div>}
        </div>
      );
    }
    
    
    return <Text className="text-sm">-</Text>;
  },
}),

    columnHelper.accessor('balance', {
  id: 'balance',
  size: 150,
  header: 'Balance',
  cell: ({ row }) => (
    <Text className="font-medium text-gray-700">
      ${row.original.balance || '0.00'}
    </Text>
  ),
}),
  columnHelper.accessor('amount', {
    id: 'amount',
    size: 150,
    header: 'Requested Amount',
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700"> ${row.original.amount || '0.00'}</Text>
    ),
  }),

  columnHelper.accessor('status', {
    id: 'status',
    size: 120,
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status),
  }),
    columnHelper.display({
    id: 'action',
    size: 120,
    cell: ({ row }) => <ActionCell row={row} />,
  }),
];