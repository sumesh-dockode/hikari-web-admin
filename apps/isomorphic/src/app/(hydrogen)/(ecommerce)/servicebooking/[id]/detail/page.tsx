import ServiceDetailGallery from "@/app/shared/ecommerce/servicebooking/service-detail-gallery";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";

export default function ServiceDetailPage({ params }: any) {
  const id = (params).id;

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

  const ServiceData = {
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
    name: 'Bag',
    promocode: 'sale100',
    selectedservices: 'Cleaning Service',
    requesteduser: 'Jithin',
    status: 'Booking_initiated',
  };

  return (
    <>
      {/* Page Header */}
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      {/* Container */}
      <div className="@container">
        {/* Status Dropdown at the Top */}
        <div className="flex justify-end mb-4">
          <ServiceDetailGallery service={ServiceData} />
        </div>
      </div>
    </>
  );
}
