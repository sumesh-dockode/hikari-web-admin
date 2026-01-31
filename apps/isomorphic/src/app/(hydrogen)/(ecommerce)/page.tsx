import EcommerceDashboard from '@/app/shared/ecommerce/dashboard';
import { metaObject } from '@/config/site.config';
import ProductsPage from './products/page';

export const metadata = {
  ...metaObject('E-Commerce'),
};

export default function eCommerceDashboardPage() {
  // return <EcommerceDashboard />
return <ProductsPage/>;
}
