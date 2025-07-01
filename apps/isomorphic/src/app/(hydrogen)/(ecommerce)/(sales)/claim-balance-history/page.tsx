import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { productsData } from '@/data/products-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';
import ClaimBalanceHistoryTable from '@/app/shared/ecommerce/sales/claim-balance-history/list/table';
import { productData } from '@/app/shared/ecommerce/product/create-edit/form-utils';

export const metadata = {
  ...metaObject('Claim Balance History'),
};

const pageHeader = {
  title: 'Claim Balance History',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.claimBalanceHistory,
      name: 'Claim Balance History',
    },
    {
      name: 'List',
    },
  ],
};

export default function ClaimBalanceHistoryPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          {/* <ExportButton
            disabled={true}
            data={productsData}
            fileName="sales_history"
            header="ID,Name,Category,Product Thumbnail,SKU,Stock,Price,Status,Rating"
          /> */}
        </div>
      </PageHeader>

      <ClaimBalanceHistoryTable pageSize={10} />
    </>
  );
}

