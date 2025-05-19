import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { ActionIcon, Text, Tooltip } from 'rizzui';
import { ServiceTypeDataType } from '@/data/service-types-data';
import { toCurrency } from '@core/utils/to-currency';

const columnHelper = createColumnHelper<ServiceTypeDataType>();

export const serviceTypesColumns = [
  columnHelper.accessor('name', {
    id: 'name',
    size: 200,
    header: 'Name',
  }),
  columnHelper.accessor('description', {
    id: 'description',
    size: 200,
    header: 'Description',
    cell: ({ getValue }) => <Text className="line-clamp-2">{getValue()}</Text>,
  }),
  columnHelper.accessor('price', {
    id: 'price',
    size: 200,
    header: 'Price',
    cell: ({ getValue }) => <Text>{toCurrency(getValue() || 0)}</Text>,
  }),
  columnHelper.accessor('duration', {
    id: 'duration',
    size: 200,
    header: 'Duration',
  }),
  columnHelper.display({
    id: 'action',
    size: 100,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip content={'Edit Service Type'} placement="top" color="invert">
          <Link
            href={routes.eCommerce.editServiceTypes(row.original.id as string)}
          >
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the Service Type`}
          description={`Are you sure you want to delete this #${row.original.name} service type?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
          isLoading={meta?.deleteId === row.original.id && meta?.isDeleting}
        />
      </div>
    ),
  }),
];
