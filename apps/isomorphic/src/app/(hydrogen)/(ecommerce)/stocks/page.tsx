import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import PageHeader from '@/app/shared/page-header';
import ProductsTable from '@/app/shared/ecommerce/product/product2/table';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';
import AddProductModal from '@/app/shared/ecommerce/product/product2/AddProductModal';
import AddProductPopup from '@/app/shared/ecommerce/product/product2/AddProductModal';

export const metadata = {
  ...metaObject('Products'),
};

const pageHeader = {
  title: 'Stocks',
  breadcrumb: [
    // {
    //   href: routes.eCommerce.dashboard,
    //   name: 'E-Commerce',
    // },
    {
      href: routes.eCommerce.products,
      name: 'Stocks',
    },
    {
      name: 'List',
    },
  ],
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          {/* <ExportButton
            data={productsData}
            fileName="product_data"
            header="ID,Name,Category,Product Thumbnail,SKU,Stock,Price,Status,Rating"
          /> */}
{/*        
          <Link
            href={routes.eCommerce.createProduct}
            className="w-full @lg:w-auto"
          ></Link> */}
          <AddProductPopup />
        </div>
      </PageHeader>

      <ProductsTable pageSize={10} />
    </>
  );
}
