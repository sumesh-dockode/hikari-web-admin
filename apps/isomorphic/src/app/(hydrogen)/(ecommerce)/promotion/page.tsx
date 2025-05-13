import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { Empty, EmptyProductBoxIcon } from 'rizzui/empty';
import Image from 'next/image';
import promotion from '@public/promotion.png';
import { Button } from 'rizzui/button';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import PromotionsTable from '@/app/shared/ecommerce/promotion/list/table';
export const metadata = {
  ...metaObject('Promotions'),
};

const pageHeader = {
  title: 'Promotions',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.promotion,
      name: 'Promotions',
    },
    {
      name: 'List',
    },
  ],
};

export default function PromotionPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.promotion}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        ></Link>
      </PageHeader>
      <PromotionsTable />
    </>
  );
}
