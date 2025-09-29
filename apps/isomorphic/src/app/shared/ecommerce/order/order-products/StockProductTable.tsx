'use client';

import Image from 'next/image';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { Text, Title, Button } from 'rizzui';
import { toCurrency } from '@core/utils/to-currency';
import noImage from '@public/no-image.jpg';
import { PiCheckBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';

interface StockProduct {
  id: string;
  product_name: string;
  variant_sku: string;
  product_image: string;
  stock_status: string;
  is_next_day_shipping_available: boolean;
  price: string;
  // onStatusChange?: (status: string) => void;
}
// Define the steps for stock status update
const stockStatusSteps = [
  { id: 1, label: 'Confirmed' },
  { id: 2, label: 'Shipped', actionLabel: 'Mark as Shipped' },
  { id: 3, label: 'Delivered', actionLabel: 'Mark as Delivered' },
];

// const columns = [
//   {
//     title: <HeaderCell title="Product" />,
//     dataIndex: 'product_name',
//     key: 'product_name',
//     width: 250,
//     render: (_: any, row: StockProduct) => (
//       <div className="flex items-center">
//         <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
//           <Image
//             alt={row.product_name}
//             src={row.product_image || noImage}
//             fill
//             sizes="(max-width: 768px) 100vw"
//             className="object-cover"
//           />
//         </div>
//         <div className="ms-4">
//           <Title as="h6" className="!text-sm font-medium">
//             {row.product_name}
//           </Title>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: <HeaderCell title="SKU" />,
//     dataIndex: 'variant_sku',
//     key: 'variant_sku',
//     width: 150,
//     render: (sku: string) => <Text className="text-sm">{sku}</Text>,
//   },
//   {
//     title: <HeaderCell title="Stock Status" />,
//     dataIndex: 'stock_status',
//     key: 'stock_status',
//     width: 200,
//     render: (status: string, row: StockProduct) => (
//       <div className="flex flex-col gap-2">
//         <Text className="text-sm">{status}</Text>
//         {status === 'Confirmed' && (
//           <Button
//             size="sm"
//             variant="outline"
//             className="w-full"
//             onClick={(e) => {
//               e.stopPropagation();
//               row.onStatusChange?.('Shipped');
//             }}
//           >
//             Mark as Shipped
//           </Button>
//         )}
//         {status === 'Shipped' && (
//           <Button
//             size="sm"
//             variant="outline"
//             className="w-full"
//             onClick={(e) => {
//               e.stopPropagation();
//               row.onStatusChange?.('Delivered');
//             }}
//           >
//             Mark as Delivered
//           </Button>
//         )}
//       </div>
//     ),
//   },
//   {
//     title: <HeaderCell title="Price" align="right" />,
//     dataIndex: 'price',
//     key: 'price',
//     width: 150,
//     render: (price: string) => (
//       <Text className="text-end text-sm">{toCurrency(price)}</Text>
//     ),
//   },
// ];

// A new component for the status stepper UI
function StockStatusStepper({
  currentStatus,
  onUpdate,
  isLoading,
}: {
  currentStatus: string;
  onUpdate: (newStatus: string) => void;
  isLoading: boolean;
}) {
  const currentStep =
    stockStatusSteps.find((step) => step.label === currentStatus)?.id ?? 0;

  return (
    <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100 py-4">
      {stockStatusSteps.map((step) => (
        <div
          key={step.id}
          className={cn(
            
            "relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[''] last:after:hidden",
            currentStep > step.id
              ? 'before:bg-primary after:bg-primary'
              : 'after:bg-gray-100',
            currentStep === step.id && 'before:bg-primary'
          )}
        >
          {currentStep >= step.id && (
         
            <span className="absolute -start-1.5 top-1 text-white">
              <PiCheckBold className="h-auto w-3" />
            </span>
          )}

          {currentStep + 1 === step.id ? (
            <Button
              size="sm"
              variant="outline"
              isLoading={isLoading}
              onClick={() => onUpdate(step.label)}
            >
              {step.actionLabel}
            </Button>
          ) : (
            <Text as="span" className={cn(currentStep < step.id && 'text-gray-500')}>
              {step.label}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
}

// interface StockProductTableProps {
//   data: StockProduct[];
//   currentStatus?: string;
//   onStatusChange?: (status: string) => void;
//   orderId?: string;
// }

// export default function StockProductTable({
//   data = [],
//   onStatusChange = () => { },
//   currentStatus = 'Confirmed',
//   orderId
// }: StockProductTableProps) {
//   return (
//     <div className="mt-10">
//       <Title as="h4" className="mb-4 text-base font-semibold">
//         Stock Products
//       </Title>
//       <Table
//         data={data.map(item => {
//           console.log('Table row data:', {
//             ...item,
//             onStatusChange: onStatusChange ? 'function exists' : 'function missing'
//           });
//           return {
//             ...item,
//             onStatusChange,
//           };
//         })}
//         // @ts-ignore
//         columns={columns}
//         className="text-sm"
//         variant="minimal"
//         rowKey={(record) => record.id}
//         scroll={{ x: 800 }}
//       />
//     </div>
//   );
// }
export default function StockProductTable({
  data,
  onUpdateStockStatus,
  isUpdating,
  updatingStockId,
}: {
  data: StockProduct[];
  onUpdateStockStatus: (stockId: string, newStatus: string) => void;
  isUpdating: boolean;
  updatingStockId: string | null;
}) {
  const columns = [
    {
      title: <HeaderCell title="Product" />,
      dataIndex: 'product_name',
      key: 'product_name',
      width: 250,
      render: (_: any, row: StockProduct) => (
        <div className="flex items-center">
          <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
            <Image
              alt={row.product_name}
              src={row.product_image || noImage}
              fill
              sizes="(max-width: 768px) 100vw"
              className="object-cover"
            />
          </div>
          <div className="ms-4">
            <Title as="h6" className="!text-sm font-medium">
              {row.product_name}
            </Title>
          </div>
        </div>
      ),
    },
    {
      title: <HeaderCell title="SKU" />,
      dataIndex: 'variant_sku',
      key: 'variant_sku',
      width: 150,
      render: (sku: string) => <Text className="text-sm">{sku}</Text>,
    },
    {
      title: <HeaderCell title="Stock Status" />,
      dataIndex: 'stock_status',
      key: 'stock_status',
      width: 250,
      render: (status: string, row: StockProduct) => (
        <StockStatusStepper
          currentStatus={status}
          isLoading={isUpdating && updatingStockId === row.id}
          onUpdate={(newStatus) => {
            // ADD THIS LOG to see the entire row's data
            console.log('Data for the clicked row:', row);
            onUpdateStockStatus(row.id, newStatus);
          }}
        />
      ),
    },
    {
      title: <HeaderCell title="Price" align="right" />,
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: string) => (
        <Text className="text-end text-sm">{toCurrency(price)}</Text>
      ),
    },
  ];

  return (
    <div className="mt-10">
      <Title as="h4" className="mb-4 text-base font-semibold">
        Stock Products
      </Title>
      <Table
        data={data}
        // @ts-ignore
        columns={columns}
        className="text-sm"
        variant="minimal"
        rowKey={(record) => record.id}
        scroll={{ x: 800 }}
      />
    </div>
  );
}
