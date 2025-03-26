import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import CreateSalesMan from '@/app/shared/ecommerce/sales-man/create-sales-man';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Salesman',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.salesman,
      name: 'Salesman',
    },
    {
      name: 'Edit',
    },
  ],
};

const salesmanData = {
  first_name: 'Sales Man',
  email: '5Hf3H@example.com',
  username: 'salesman',
  password: 'passwordsss',
  images: {
    name: 'profile',
    url: 'https://isomorphic-furyroad.s3.amazonaws.com/public/products/details/1.jpg',
    size: 100,
  },
  is_active: true,
};

export default async function EditSalesmanPage({ params }: any) {
  const id = (await params).id;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.salesman}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>

      <CreateSalesMan id={id} initialValue={salesmanData} />
    </>
  );
}
