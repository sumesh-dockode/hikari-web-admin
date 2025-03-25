import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import StoreManagerPageHeader from './store-manager-page-header';
import StoreManagerTable from '@/app/shared/ecommerce/store-manager/list/table';

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
      <StoreManagerPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <StoreManagerTable />
    </>
  );
}
