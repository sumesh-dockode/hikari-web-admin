import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import SuggestionsTable from '@/app/shared/ecommerce/sales/suggestions/list/table';
export const metadata = {
  ...metaObject('Suggestions'),
};

const pageHeader = {
  title: 'Suggestions',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.suggestions,
      name: 'Suggestions',
    },
    {
      name: 'List',
    },
  ],
};

export default function Suggestions() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        {/* <Link
          href={routes.eCommerce.suggestions}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        ></Link> */}
      </PageHeader>
      <SuggestionsTable />
    </>
  );
}
