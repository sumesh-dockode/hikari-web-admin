import Link from 'next/link';
import { Metadata } from 'next';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import CreatePromotion from '@/app/shared/ecommerce/promotion/create-promotion';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * for dynamic metadata
 * @link: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return metaObject(`Edit ${id}`);
}

// TODO: Need added Order date default value

const pageHeader = {
  title: 'Edit Promotion',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.promotion,
      name: 'Promotions',
    },
    {
      name: 'Edit',
    },
  ],
};

const promotionData = {
  productname: 'General',
  requestedby: 'John Doe',
  promotionmedium: 'Facebook',
  comments: 'nil',
  aspectratio: '16:9',
  area: 'kerala',
  images: [
    {
      name: 'images',
      url: 'https://picsum.photos/200/300',
      size: 10,
    },
  ],
  document: [
    {
      name: 'document.pdf',
      url: 'https://www.soundczech.cz/temp/lorem-ipsum.pdf',
      size: 10,
    },
  ],
};

const categoryData = {
  name: 'Vegetables',
  slug: 'vegetables',
  type: 'Diet Foods',
  parentCategory: 'Grocery',
  description: 'Incredible Granite Ball',
  images: undefined,
};

export default async function EditPromotionPage({ params }: any) {
  const id = (await params).id;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.promotion}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <CreatePromotion id={id} promotion={promotionData} />
    </>
  );
}
