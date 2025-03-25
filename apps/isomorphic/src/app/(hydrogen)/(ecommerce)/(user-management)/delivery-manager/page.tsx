import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import DeliveryManagerPageHeader from './delivery-manager-page-header';
import DeliveryManagerTable from '@/app/shared/ecommerce/delivery-manager/list/table';

export const metadata = {
  ...metaObject('Delivery Manager'),
};

const pageHeader = {
  title: 'Delivery Manager',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.deliveryManager,
      name: 'Delivery Manager',
    },
    {
      name: 'List',
    },
  ],
};

export default function DeliveryManagerPage() {
  return (
    <>
      <DeliveryManagerPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <DeliveryManagerTable />
    </>
  );
}
