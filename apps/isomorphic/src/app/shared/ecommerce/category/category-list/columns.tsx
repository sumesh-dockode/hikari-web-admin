'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { ActionIcon, Checkbox, Title, Tooltip } from 'rizzui';
// import { CategoryDataType } from './table';
export interface CategoryDataType {
  id: string;
  image: string;
  icon_image: string;  // Changed from 'icon'
  name: string;
  group: string;      // Changed from 'slug'
  products?: number;
  description?: string;
  // Add other API fields as needed
}
const columnHelper = createColumnHelper<CategoryDataType>();

export const categoriesColumns = [
  // columnHelper.display({
  //   id: 'checked',
  //   size: 50,
  //   cell: ({ row }) => (
  //     <Checkbox
  //       aria-label="Select row"
  //       className="ps-3.5"
  //       checked={row.getIsSelected()}
  //       onChange={row.getToggleSelectedHandler()}
  //     />
  //   ),
  // }),
  columnHelper.display({
    id: 'image',
    size: 100,
    header: 'Image',
    cell: ({ row }) => (
      <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={row.original.name}
          src={row.original.image}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />
      </figure>
    ),
  }),
  columnHelper.display({
    id: 'icon',
    size: 100,
    header: 'Icon',
    cell: ({ row }) => (
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
        <Image
          src={row.original.icon_image}
          alt={row.original.name}
          width={24}
          height={24}
          className="h-6 w-6 object-contain"
        />
      </div>
    ),
  }),
  columnHelper.accessor('name', {
    id: 'name',
    size: 200,
    header: 'Category Name',
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
        {getValue()}
      </Title>
    ),
  }),
  // columnHelper.display({
  //   id: 'description',
  //   size: 250,
  //   header: 'Description',
  //   cell: ({ row }) => (
  //     <Text className="truncate !text-sm">{row.original.description}</Text>
  //   ),
  // }),
 
  columnHelper.display({
    id: 'products',
    size: 120,
    header: 'Products',
    cell: ({ row }) => <div className="ps-6">{row.original.products}</div>,
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
        <Tooltip content={'Edit Category'} placement="top" color="invert">
          <Link href={routes.eCommerce.editCategory(row.original.id)}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the category`}
          description={`Are you sure you want to delete this #${row.original.id} category?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];
