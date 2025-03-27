import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import CreateStoreManager from '@/app/shared/ecommerce/store-manager/create-store-manager';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from 'rizzui/button';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Store Manager',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.storeManager,
      name: 'Store Manager',
    },
    {
      name: 'Edit',
    },
  ],
};

const storeManagerData = {
  first_name: 'Store Manager',
  email: '5Hf3H@example.com',
  username: 'store_manager',
  password: 'password',
  store_name: 'New Store',
  store_address: 'New Address',
};

export default async function EditStoreManagerPage({ params }: any) {
  const id = (await params).id;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.storeManager}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>

      <CreateStoreManager id={id} initialValue={storeManagerData} />
    </>
  );
}
