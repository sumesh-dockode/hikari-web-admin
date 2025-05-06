import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';

// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  // label start
  {
    name: 'Home',
  },
  // label end
  {
    name: 'E-Commerce',
    href: routes.eCommerce.dashboard,
  },
  { name: 'Products' },
  {
    name: 'products',
    href: routes.eCommerce.products,
  },
  {
    name: 'Create Product',
    href: routes.eCommerce.createProduct,
  },
  {
    name: 'Product Variants',
    href: routes.eCommerce.productVariants,
  },
  {
    name: 'Product Specifications',
    href: routes.eCommerce.productSpecifications,
  },
  { name: 'Categories' },
  {
    name: 'Categories',
    href: routes.eCommerce.categories,
  },
  {
    name: 'Create Categories',
    href: routes.eCommerce.createCategory,
  },
  { name: 'Orders' },
  {
    name: 'Orders',
    href: routes.eCommerce.orders,
  },
  {
    name: 'Create Order',
    href: routes.eCommerce.createOrder,
  },

  { name: 'Sales' },
  {
    name: 'Salesman',
    href: routes.eCommerce.salesman,
  },
  {
    name: 'Create Salesman',
    href: routes.eCommerce.createSalesman,
  },
  {
    name: 'Sales History',
    href: routes.eCommerce.salesHistory,
  },
  {
    name: 'Incentives',
    href: routes.eCommerce.incentives,
  },
  {
    name: 'Claim Balance History',
    href: routes.eCommerce.claimBalanceHistory,
  },
  {
    name: 'Delivery',
  },
  {
    name: 'Delivery Manager',
    href: routes.eCommerce.deliveryManager,
  },
  {
    name: 'Create Delivery Manager',
    href: routes.eCommerce.createDeliveryManager,
  },
  {
    name: 'Promotion',
    href: routes.eCommerce.promotion,
  },
  {
    name: 'Service Booking',
    href: routes.eCommerce.servicebooking,
  },
];