import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import SalesManTable from '@/app/shared/ecommerce/sales-man/list/table';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';

export const metadata = {
  ...metaObject('Salesman'),
};

const pageHeader = {
  title: 'Salesman',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.salesman,
      name: 'Salesman',
    },
    {
      name: 'List',
    },
  ],
};

export default function SalesManPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createSalesman}
          className="w-full @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Salesman
          </Button>
        </Link>
      </PageHeader>
      <SalesManTable />
    </>
  );
}
