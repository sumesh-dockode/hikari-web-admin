import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import StoreManagerTable from '@/app/shared/ecommerce/store-manager/list/table';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';

export const metadata = {
  ...metaObject('Store Manager'),
};

const pageHeader = {
  title: 'Store Manager',
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
      name: 'List',
    },
  ],
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createStoreManager}
          className="w-full @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Store Manager
          </Button>
        </Link>
      </PageHeader>
      <StoreManagerTable />
    </>
  );
}
