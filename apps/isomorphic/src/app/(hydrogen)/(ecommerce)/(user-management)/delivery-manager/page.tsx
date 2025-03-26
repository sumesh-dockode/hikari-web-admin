import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import DeliveryManagerTable from '@/app/shared/ecommerce/delivery-manager/list/table';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';

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
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createDeliveryManager}
          className="w-full @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Delivery Manager
          </Button>
        </Link>
      </PageHeader>
      <DeliveryManagerTable />
    </>
  );
}
