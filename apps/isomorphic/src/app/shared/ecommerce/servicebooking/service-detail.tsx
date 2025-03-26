'use client';

import { useParams } from 'next/navigation';
import ServiceDetailGallery from './service-detail-gallery';

export default function ServiceDetails() {
  const params = useParams();

  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ServiceDetailGallery
          />
        </div>
      </div>
    </div>
  );
}
