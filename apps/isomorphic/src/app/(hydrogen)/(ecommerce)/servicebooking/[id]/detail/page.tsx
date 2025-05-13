import ServiceDetailGallery from '@/app/shared/ecommerce/servicebooking/service-detail-gallery';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';

interface PageProps {
  params: { id: string };
}

export default async function ServiceDetailPage({ params }: PageProps) {
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
      <div className="@container">
        <div className="mb-4 flex justify-end">
          <ServiceDetailGallery />
        </div>
      </div>
    </>
  );
}
