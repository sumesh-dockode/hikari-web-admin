import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import CreateDeliveryManager from '@/app/shared/ecommerce/delivery-manager/create-delivery-manager';

export const metadata = {
  ...metaObject('Create Delivery Manager'),
};

const pageHeader = {
  title: 'Create Delivery Manager',
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
      name: 'Create',
    },
  ],
};

export default function CreateDeliveryManagerPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.deliveryManager}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>

      <CreateDeliveryManager />
    </>
  );
}
