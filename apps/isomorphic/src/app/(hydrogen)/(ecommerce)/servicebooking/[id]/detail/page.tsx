import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Service Details'),
};

export default async function ServiceDetailPage({ params }: any) {
  const id = (await params).id;

  const pageHeader = {
    title: 'Service Booking',
    breadcrumb: [
      {
        href: routes.eCommerce.dashboard,
        name: 'E-Commerce',
      },
      {
        href: routes.eCommerce.servicebooking,
        name: 'Service Details',
      },
      {
        name: id,
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProductDetails />
    </>
  );
}
