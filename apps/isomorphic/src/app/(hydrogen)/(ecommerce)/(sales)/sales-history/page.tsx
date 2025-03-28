import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { productsData } from '@/data/products-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';
import SalesHistoryTable from '@/app/shared/ecommerce/sales/sales-history/list/table';

export const metadata = {
  ...metaObject('Sales History'),
};

const pageHeader = {
  title: 'Sales History',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.salesHistory,
      name: 'Sales History',
    },
    {
      name: 'List',
    },
  ],
};

export default function SalesHistoryPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            disabled={true}
            data={productsData}
            fileName="sales_history"
            header="ID,Name,Category,Product Thumbnail,SKU,Stock,Price,Status,Rating"
          />
        </div>
      </PageHeader>

      <SalesHistoryTable pageSize={10} />
    </>
  );
}
