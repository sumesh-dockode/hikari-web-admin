'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import PageHeader from '@/app/shared/page-header';
import ProductsTable from '@/app/shared/ecommerce/product/stock/table';
import ExportButton from '@/app/shared/export-button';
import AddProductModal from '@/app/shared/ecommerce/product/product2/AddProductModal';
import AddProductView from '@/app/shared/ecommerce/product/stock/AddProductModal'

const pageHeader = {
  title: 'Products',
  breadcrumb: [

    {
      href: routes.eCommerce.products,
      name: 'Products',
    },
    {
      name: 'List',
    },
  ],
};

export default function ProductsPage() {
  const refreshFnRef = useRef<(() => void) | null>(null);

  const handleRefresh = (fn: () => void) => {
    refreshFnRef.current = fn;
  };

  const handleStockAdded = () => {
    if (refreshFnRef.current) {
      refreshFnRef.current();
    }
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          {/* <ExportButton
            data={productsData}
            fileName="product_data"
            header="ID,Name,Category,Product Thumbnail,SKU,Stock,Price,Status,Rating"
          /> */}
          <></>
             
          <Link
            href={routes.eCommerce.createProduct}
            className="w-full @lg:w-auto"
          ></Link>
          <AddProductView />
        </div>
      </PageHeader>

      <ProductsTable pageSize={10}/>
    </>
  );
}
