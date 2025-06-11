import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';
import ServiceTypesTable from '@/app/shared/ecommerce/service-types/list/table';
export const metadata = {
  ...metaObject('Service Types'),
};

const pageHeader = {
  title: 'Service Types',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.servicebooking,
      name: 'Service Types',
    },
    {
      name: 'List',
    },
  ],
};

export default function ServiceTypes() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createServiceTypes}
          className="w-full @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Service Type
          </Button>
        </Link>
      </PageHeader>
      <ServiceTypesTable />
    </div>
  );
}
