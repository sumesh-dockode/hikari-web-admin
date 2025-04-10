import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import OrdersTable from '@/app/shared/ecommerce/order/order-list/table';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Orders'),
};

const pageHeader = {
  title: 'Orders',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.orders,
      name: 'Orders',
    },
    {
      name: 'List',
    },
  ],
};

export default function OrdersPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <OrdersTable />
    </>
  );
}
