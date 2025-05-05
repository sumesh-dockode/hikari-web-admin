import { CreateProductInput } from '@/validators/create-product.schema';
import isEmpty from 'lodash/isEmpty';

export const customFields = [
  {
    label: '',
    value: '',
  },
];
export const locationShipping = [
  {
    name: '',
    shippingCharge: '',
  },
];
export const productVariants = [
  {
    label: '',
    value: '',
  },
];
export const productSpecifications = [
  {
    label: '',
    value: '',
  },
];

export function defaultValues(product?: CreateProductInput) {
  return {
    title: product?.title ?? '',
    sku: product?.sku ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    // images: product?.images ?? undefined,

    productVariants: isEmpty(product?.productVariants)
      ? productVariants
      : product?.productVariants,
    // tags: product?.tags ?? [],
  };
}

export const productData = {
  title: 'Apple',
  description: 'Fresh Express Iceberg Garden Salad Blend',
  sku: 'SKU-28935',
  type: 'Digital Product',
  categories: 'Grocery',
  price: 10,
  costPrice: 20,
  retailPrice: 15,
  salePrice: 25,
  productImages: undefined,
  inventoryTracking: 'no',
  currentStock: '150',
  lowStock: '20',
  productAvailability: 'online',
  tradeNumber: '12345',
  manufacturerNumber: '154',
  brand: 'Foska',
  upcEan: 'Ean',
  customFields: [
    {
      label: 'Color',
      value: 'Red',
    },
  ],
  freeShipping: false,
  shippingPrice: 45,
  locationBasedShipping: true,
  locationShipping: [
    {
      name: 'USA',
      shippingCharge: '150',
    },
  ],
  pageTitle: 'apple',
  metaDescription: 'apple',
  metaKeywords: 'grocery, foods',
  productUrl: 'http://localhost:3000/',
  isPurchaseSpecifyDate: true,
  isLimitDate: true,
  dateFieldName: 'Date Field',
  productVariants: [
    {
      name: 'Jhon',
      value: '150',
    },
  ],
  tags: ['iPhone', 'mobile'],
};

export const menuItems = [
  {
    label: 'Summary',
    value: 'summary',
  },
  {
    label: 'Images & Gallery',
    value: 'images_gallery',
  },
  {
    label: 'Pricing & Inventory',
    value: 'pricing_inventory',
  },
  {
    label: 'Product Identifiers & Custom Fields',
    value: 'product_identifiers',
  },
  {
    label: 'Shipping & Availability',
    value: 'shipping_availability',
  },
  {
    label: 'SEO',
    value: 'seo',
  },
  {
    label: 'Variant Options',
    value: 'variant_options',
  },
];

// Category option
export const categoryOption = [
  {
    value: 'fruits',
    label: 'Fruits',
  },
  {
    value: 'grocery',
    label: 'Grocery',
  },
  {
    value: 'meat',
    label: 'Meat',
  },
  {
    value: 'cat food',
    label: 'Cat Food',
  },
];

// Type option
export const typeOption = [
  {
    value: 'digital product',
    label: 'Digital Product',
  },
  {
    value: 'physical product',
    label: 'Physical Product',
  },
];

// Variant option
export const variantOption = [
  {
    value: 'single',
    label: 'Single',
  },
  {
    value: 'multiple',
    label: 'Multiple',
  },
];

export const materialOptions = [
  {
    value: 'velvet',
    label: 'Velvet',
  },
  {
    value: 'memory_foam',
    label: 'Memory Foam',
  },
  {
    value: 'fiber_fill',
    label: 'Fiber Fill',
  },
];
