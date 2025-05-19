import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import CreateServiceTypes from '@/app/shared/ecommerce/service-types/create-service-types';

export const metadata = {
  ...metaObject('Create Service Types'),
};

const pageHeader = {
  title: 'Create Service Types',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.serviceTypes,
      name: 'Service Types',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateServiceTypesPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.serviceTypes}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>

      <CreateServiceTypes />
    </>
  );
}
