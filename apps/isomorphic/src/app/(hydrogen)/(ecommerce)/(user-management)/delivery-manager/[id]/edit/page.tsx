import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import CreateDeliveryManager from '@/app/shared/ecommerce/delivery-manager/create-delivery-manager';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Delivery Manager',
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
      name: 'Edit',
    },
  ],
};

const deliveryManagerData = { name: 'Delivery Manager' };

export default async function EditDeliveryManagerPage({ params }: any) {
  const id = (await params).id;

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

      <CreateDeliveryManager id={id} initialValue={deliveryManagerData} />
    </>
  );
}
