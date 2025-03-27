import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import CreateStoreManager from '@/app/shared/ecommerce/store-manager/create-store-manager';

export const metadata = {
  ...metaObject('Create Store Manager'),
};

const pageHeader = {
  title: 'Create Store Manager',
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
      name: 'Create',
    },
  ],
};

export default function CreateStoreManagerPage() {
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

      <CreateStoreManager />
    </>
  );
}
