import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { productsData } from '@/data/products-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';
import IncentivesTable from '@/app/shared/ecommerce/sales/incentives/list/table';

export const metadata = {
  ...metaObject('Incentives'),
};

const pageHeader = {
  title: 'Incentives',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.incentives,
      name: 'Incentives',
    },
    {
      name: 'List',
    },
  ],
};

export default function IncentivesPage() {
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

      <IncentivesTable pageSize={10} />
    </>
  );
}
