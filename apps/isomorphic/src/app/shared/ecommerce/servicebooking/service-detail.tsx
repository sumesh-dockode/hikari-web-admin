'use client';

import { useParams } from 'next/navigation';
import { modernProductsGrid } from '@/data/shop-products';
import { generateSlug } from '@core/utils/generate-slug';
import ServiceDetailGallery from './service-detail-gallery';

export default function ServiceDetails() {
  const params = useParams();
  const product =
    modernProductsGrid.find(
      (item) => generateSlug(item.title) === params.slug
    ) ?? modernProductsGrid[0];
  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ServiceDetailGallery />
        </div>
      </div>
    </div>
  );
}
