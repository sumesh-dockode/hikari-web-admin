import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import SalesManPageHeader from './salesman-page-header';
import SalesManTable from '@/app/shared/ecommerce/sales-man/list/table';

export const metadata = {
  ...metaObject('Sales Man'),
};

const pageHeader = {
  title: 'Sales Man',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.salesMan,
      name: 'Sales Man',
    },
    {
      name: 'List',
    },
  ],
};

export default function SalesManPage() {
  return (
    <>
      <SalesManPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <SalesManTable />
    </>
  );
}
