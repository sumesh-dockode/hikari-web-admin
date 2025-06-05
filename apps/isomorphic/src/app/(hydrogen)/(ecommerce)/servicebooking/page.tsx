import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import ServiceBookingTable from '@/app/shared/ecommerce/servicebooking/bookinglist/table';
export const metadata = {
  ...metaObject('servicebooking'),
};

const pageHeader = {
  title: 'Service Booking',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.servicebooking,
      name: 'Service Booking',
    },
    {
      name: 'List',
    },
  ],
};

export default function ServiceBookingPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.servicebooking}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        ></Link>
      </PageHeader>
      <ServiceBookingTable />
    </>
  );
}

