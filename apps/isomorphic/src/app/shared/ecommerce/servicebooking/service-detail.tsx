'use client';

import { useParams } from 'next/navigation';
import { modernProductsGrid } from '@/data/shop-products';
import { generateSlug } from '@core/utils/generate-slug';
import ServiceDetailGallery from './service-detail-gallery';
import ServiceDetailSummary from './service-detail-summary';

export default function ServiceDetails() {
  const params = useParams();

  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ServiceDetailGallery
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
        {/* <div className="col-span-5 @container">
          <ServiceDetailSummary
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div> */}
      </div>
    </div>
  );
}
