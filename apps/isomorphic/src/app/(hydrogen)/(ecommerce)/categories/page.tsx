import { routes } from '@/config/routes';
import CategoryTable from '@/app/shared/ecommerce/category/category-list/table';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';

export const metadata = {
  ...metaObject('Categories'),
};

const pageHeader = {
  title: 'Categories',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.categories,
      name: 'Categories',
    },
    {
      name: 'List',
    },
  ],
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createCategory}
          className="w-full @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Category
          </Button>
        </Link>
      </PageHeader>
      <CategoryTable />
    </>
  );
}
