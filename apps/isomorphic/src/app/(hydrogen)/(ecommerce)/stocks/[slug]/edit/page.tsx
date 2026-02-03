import Link from 'next/link';
import { Metadata } from 'next';
import { PiPlusBold } from 'react-icons/pi';
import { productData } from '@/app/shared/ecommerce/product/create-edit/form-utils';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const slug = (await params).slug;

  return metaObject(`Edit ${slug}`);
}

const pageHeader = {
  title: 'Edit Product',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.products,
      name: 'Products',
    },
    {
      name: 'Edit',
    },
  ],
};

export default async function EditProductPage({ params }: any) {
  const slug = (await params).slug;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.products}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>

      <CreateEditProduct slug={slug} />
    </>
  );
}
