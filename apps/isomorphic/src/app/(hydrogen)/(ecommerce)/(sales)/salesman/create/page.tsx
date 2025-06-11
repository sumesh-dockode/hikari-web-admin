import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import CreateSalesMan from '@/app/shared/ecommerce/sales/sales-man/create-sales-man';

export const metadata = {
  ...metaObject('Create Salesman'),
};

const pageHeader = {
  title: 'Create Salesman',
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
      name: 'Create',
    },
  ],
};

export default function CreateSalesmanPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.salesman}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>

      <CreateSalesMan />
    </>
  );
}
