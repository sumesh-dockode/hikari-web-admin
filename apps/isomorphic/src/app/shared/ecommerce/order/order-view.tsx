'use client';

import { PiCheckBold } from 'react-icons/pi';
import { Title, Text, Button, Avatar, Select } from 'rizzui';
import cn from '@core/utils/class-names';
import { toCurrency } from '@core/utils/to-currency';
import { formatDate } from '@core/utils/format-date';
import { useParams } from 'next/navigation';
import { useOrderById } from '@/hooks/orders/useOrderById';
import { useOrderStatusChange } from '@/hooks/orders/useOrderStatusChange';
import PageLoader from '../../page-loader';
import OrderViewProducts from './order-products/order-view-products';
import usePaginatedDeliveryManager from '@/hooks/DeliveryManager/usePaginatedDeliveryManager';
import StockProductTable from './order-products/StockProductTable';
import { useOrderStocks } from '@/hooks/orders/useOrderStocks';
import { useUpdateOrder } from '@/hooks/orders/useUpdateOrder';


const baseStatusActions = [
  { id: 1, label: 'Ordered', actionLabel: '' },
  { id: 2, label: 'Confirmed', actionLabel: 'Mark as Confirmed' },
  { id: 3, label: 'Shipped', actionLabel: 'Mark as Shipped' },
  { id: 4, label: 'Delivered', actionLabel: 'Mark as Delivered' },
];

function WidgetCard({
  title,
  className = '',
  children,
  childrenWrapperClass = '',
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
  childrenWrapperClass?: string;
}) {
  return (
    <div className={className}>
      <Title
        as="h3"
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
      >
        {title}
      </Title>
      <div
        className={cn(
          'rounded-lg border border-muted px-5 @sm:px-7 @5xl:rounded-xl',
          childrenWrapperClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function OrderView() {
  const { id } = useParams();
  const { data, isLoading: isLoading } = useOrderById(id as string);
  const { mutate: updateOrderStatus, status } = useOrderStatusChange();
  const { data: deliveryManagerData, isLoading: isManagersLoading } = usePaginatedDeliveryManager({});
  // const [assignedStoreManager, setAssignedStoreManager] = useState<
  //   number | undefined
  // >();

  const orderData = data?.data;
  const { data: stockProductData, isLoading: isStockLoading } = useOrderStocks(id as string);
  const { mutate: updateOrder, error, isError } = useUpdateOrder();

  console.log('stockProductData:', stockProductData);
  const totalItems = orderData?.items?.length || 0;
  const totalPrice = parseFloat(orderData?.total_price || 0);
  const isCancelled = orderData?.status === 'Cancelled';

  const orderStatusActions = !isCancelled
    ? baseStatusActions
    : [
        { id: 1, label: 'Ordered', actionLabel: '' },
        { id: 5, label: 'Cancelled', actionLabel: '' },
      ];

  const currentOrderStatus =
    orderStatusActions.find((status) => status.label === orderData?.status)
      ?.id || 1;

  const handleChangeStatus = (orderId: number) => {
    const status = orderStatusActions.find(
      (status) => status.id === orderId
    )?.label;

    if (status) {
      const payload = {
        status: status,
        id: id as string,
      };

      updateOrderStatus(payload);
    }
  };

  const handleCancelOrder = () => {
    const payload = {
      status: 'Cancelled',
      id: id as string,
    };

    updateOrderStatus(payload);
  };

  
  const handleAssignDeliveryManager = (managerId: number) => {
    console.log('Assigning manager:', managerId);
    console.log('Order data:', orderData);
    
    const payload = {
      assignee_id: managerId.toString(), 
    };
    
    console.log('Payload being sent:', payload);
    updateOrder({
      id: orderData.id.toString(),
      ...payload
    });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="@container">
      <div className="flex flex-wrap items-center justify-center border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-start">
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {/* October 22, 2022 at 10:30 pm */}
          {formatDate(new Date(orderData?.created_at), 'MMMM D, YYYY')} at{' '}
          {formatDate(new Date(orderData?.created_at), 'h:mm A')}
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {totalItems} Items
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          Total {toCurrency(totalPrice)}
        </span>
        {orderData?.assigned_to && (
          <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
            Assigned to:{' '}
            <b>
              {(() => {
                const assigned = deliveryManagerData?.data.find(
                  (item: any) => item.id === orderData.assignee_id
                );
                return assigned
                  ? `${assigned.first_name} ${assigned.last_name}`
                  : '';
              })()}
            </b>
          </span>
        )}
      </div>
      <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          {/* {orderNote && (
            <div className="">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Notes About Order
              </span>
              <div className="rounded-xl border border-muted px-5 py-3 text-sm leading-[1.85]">
                {orderNote}
              </div>
            </div>
          )} */}

          <div className="pb-5">
            <OrderViewProducts items={orderData?.items} />
            <div className="border-t border-muted pt-7 @5xl:mt-3">
              <div className="ms-auto max-w-lg space-y-6">
                <div className="flex justify-between font-medium">
                  Subtotal <span>{toCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between border-t border-muted pt-5 text-base font-semibold">
                  Total <span>{toCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
            {isStockLoading ? (
  <div className="text-sm text-muted"></div>
) : stockProductData?.length > 0 ? (
  <StockProductTable data={stockProductData} />
) : null}


          </div>

          {/* <div className="">
            <div className="mb-3.5 @5xl:mb-5">
              <Title as="h3" className="text-base font-semibold @7xl:text-lg">
                Balance
              </Title>
            </div>
            <div className="space-y-6 rounded-xl border border-muted px-5 py-6 @5xl:space-y-7 @5xl:p-7">
              <div className="flex justify-between font-medium">
                Total Order <span>$5275.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Total Return <span>$350.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Paid By Customer <span>$3000.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Refunded <span>$350.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Balance <span>$4975.00</span>
              </div>
            </div>
          </div> */}
        </div>
        <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <WidgetCard
            title="Order Status"
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100">
              {orderStatusActions.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[''] last:after:hidden",
                    currentOrderStatus > item.id
                      ? 'before:bg-primary after:bg-primary'
                      : 'after:hidden',
                    currentOrderStatus === item.id && 'before:bg-primary',
                    currentOrderStatus + 1 < item.id && 'text-gray-300',
                    isCancelled && 'before:bg-red-500 after:bg-red-500'
                  )}
                >
                  {currentOrderStatus >= item.id ? (
                    <span className="absolute -start-1.5 top-1 text-white">
                      <PiCheckBold className="h-auto w-3" />
                    </span>
                  ) : null}

                  {currentOrderStatus + 1 !== item.id ? (
                    item.label
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={status === 'pending'}
                      onClick={() => handleChangeStatus(item.id)}
                    >
                      {item.actionLabel}
                    </Button>
                  )}
                  {item.id === 2 && currentOrderStatus === 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      color="danger"
                      isLoading={status === 'pending'}
                      className="ms-2"
                      onClick={handleCancelOrder}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </WidgetCard>

          {/* Delivery mng */}
        {(orderData?.assigned_to || orderData?.status === 'Confirmed') && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-sm">
              Delivery Manager
            </label>
            {orderData?.assigned_to ? (
              <div>
                Assigned to:{' '}
                <b>
                  {(() => {
                    const assigned = deliveryManagerData?.data.find(
                      (item: any) => item.id === orderData.assigned_to
                    );
                    return assigned
                      ? `${assigned.first_name} ${assigned.last_name}`
                      : 'Unknown';
                  })()}
                </b>
              </div>
            ) : (
              <Select
                options={deliveryManagerData?.data?.map((manager: any) => ({
                  label: `${manager.first_name} ${manager.last_name}`,
                  value: manager.id,
                }))}
                onChange={(selected) => {
                  console.log('Selected manager:', selected);
                  handleAssignDeliveryManager((selected as { value: number }).value);
                }}
                placeholder="Select Delivery Manager"
                searchable
              />
            )}
          </div>
        )}

          <WidgetCard
            title="Customer Details"
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="relative aspect-square h-16 w-16 shrink-0 @5xl:h-20 @5xl:w-20">
              <Avatar
                size="lg"
                color="primary"
                name={orderData?.order_info?.name || ''}
                // src={row.original.customer.avatar}
              />
            </div>
            <div className="ps-4 @5xl:ps-6">
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                {orderData?.order_info?.name || ''}
              </Title>
              <Text as="p" className="mb-2 break-all last:mb-0">
                {orderData?.order_info?.address || ''}
              </Text>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Shipping Address"
            childrenWrapperClass="@5xl:py-6 py-5"
          >
            <Title
              as="h3"
              className="mb-2.5 text-base font-semibold @7xl:text-lg"
            >
              {orderData?.order_info?.name}
            </Title>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              {orderData?.order_info?.address}
            </Text>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}


