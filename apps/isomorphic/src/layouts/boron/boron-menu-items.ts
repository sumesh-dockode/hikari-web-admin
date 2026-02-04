import { routes } from '@/config/routes';
import { Package, Warehouse } from 'lucide-react';

export const menuItems = [
  { name: 'Hikari' },
  {
    name: 'Products',
    href: routes.eCommerce.products,
    logo: Package,
  },
  {
    name: 'Stocks',
    href: routes.eCommerce.stocks,
    logo: Warehouse,
  },
];
