export type productsDataType = {
  id: string;
  name: string;
  category: any;
  images?: string | any;
  sku?: string;
  description?: string;
  stock?: number;
  price?: string;
  is_next_day_shipping_available?: boolean;
  product_images?: any;
  // status: string;
  // rating: any;
};
export type variantDataType = {
  id: string | null;
  name: string;
}
export type ProductVariantDataType = {
  id?: string | null;
  product?: string; // Add product field here
  variants?: any;
  attributes?: any;
  value?: string;
  price?: number;
  sku?: string;
  images?: { image: string }[];
  stock: number;
  extras?: { incentive_type: string; incentive_value?: number };
};

export type variantValuesDataType = {
  id: string|null;
  name?: string;
  value?: string;
  attribute?: any;
}
export type specificationDataType = {
  id?: string | null;
  name?: any;
  value?: string;
  product?: any;
}
export type specificationValueDataType = {
  id?: string | null;
  name?: string;
  value?: string;
  product?: any;
  specification?: any;
}
export const productsData = [
  {
    id: '0o02051402',
    name: 'Tasty Metal Shirt',
    category: 'Books',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
    sku: '52442',
    stock: 30,
    price: '410.00',
    status: 'Pending',
    rating: [4, 5, 3, 2],
  },
  {
    id: '0o17477864',
    name: 'Modern Gloves',
    category: 'Kids',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/3.webp',
    sku: '98424',
    stock: 0,
    price: '340.00',
    status: 'Draft',
    rating: [4, 5],
  },
  {
    id: '0o02374305',
    name: 'Rustic Steel Computer',
    category: 'Games',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/1.webp',
    sku: '78192',
    stock: 50,
    price: '948.00',
    status: 'Draft',
    rating: [4, 5, 2, 5, 3],
  },
  {
    id: '0o02602714',
    name: 'Licensed Concrete Cheese',
    category: 'Electronics',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/11.webp',
    sku: '86229',
    stock: 0,
    price: '853.00',
    status: 'Pending',
    rating: [3, 2],
  },
  {
    id: '0o54011366',
    name: 'Electronic Rubber Table',
    category: 'Books',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/15.webp',
    sku: '89762',
    stock: 18,
    price: '881.00',
    status: 'Publish',
    rating: [3, 4, 5],
  },
  {
    id: '0o24033230',
    name: 'Gorgeous Bronze Gloves',
    category: 'Shoes',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/16.webp',
    sku: '21065',
    stock: 9,
    price: '124.00',
    status: 'Pending',
    rating: [5, 5, 4, 3, 2],
  },
  {
    id: '0o27342230',
    name: 'Practical Steel Keyboard',
    category: 'Kids',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/6.webp',
    sku: '41063',
    stock: 0,
    price: '890.00',
    status: 'Pending',
    rating: [5, 2],
  },
  {
    id: '0o64235224',
    name: 'Sleek Frozen Ball',
    category: 'Electronics',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/8.webp',
    sku: '13240',
    stock: 9,
    price: '980.00',
    status: 'Publish',
    rating: [4, 2],
  },
  {
    id: '0o63671734',
    name: 'Ergonomic Frozen Pants',
    category: 'Games',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/9.webp',
    sku: '26214',
    stock: 0,
    price: '289.00',
    status: 'Pending',
    rating: [2, 5, 4],
  },
  {
    id: '0o60206537',
    name: 'Sleek Fresh Chair',
    category: 'Garden',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/10.webp',
    sku: '14317',
    stock: 24,
    price: '587.00',
    status: 'Draft',
    rating: [4, 3, 2, 5],
  },
  {
    id: '0o53505174',
    name: 'Awesome Granite Chicken',
    category: 'Electronics',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/12.webp',
    sku: '21944',
    stock: 9,
    price: '581.00',
    status: 'Pending',
    rating: [3, 2, 4, 5],
  },
  {
    id: '0o20360446',
    name: 'Rustic Concrete Ball',
    category: 'Books',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/4.webp',
    sku: '93411',
    stock: 18,
    price: '946.00',
    status: 'Pending',
    rating: [2, 5, 5],
  },
  {
    id: '0o05416424',
    name: 'Electronic Concrete Computer',
    category: 'Tools',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/13.webp',
    sku: '61422',
    stock: 24,
    price: '448.00',
    status: 'Pending',
    rating: [2, 5, 4, 5],
  },
  {
    id: '0o52110435',
    name: 'Small Wooden Pizza',
    category: 'Toys',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/14.webp',
    sku: '30532',
    stock: 0,
    price: '676.00',
    status: 'Draft',
    rating: [5, 3, 4],
  },
  {
    id: '0o40214300',
    name: 'Tasty Bronze Salad',
    category: 'Baby',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/4.webp',
    sku: '47948',
    stock: 9,
    price: '524.00',
    status: 'Draft',
    rating: [5, 5, 4, 3],
  },
  {
    id: '0o02061402',
    name: 'Tasty Metal T-Shirt',
    category: 'shirt',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
    sku: '52342',
    stock: 0,
    price: '400.00',
    status: 'publish',
    rating: [4, 5, 3, 2],
  },
  {
    id: '0o17477064',
    name: 'Modern Cotton Gloves',
    category: 'Kids',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/3.webp',
    sku: '98414',
    stock: 0,
    price: '342.00',
    status: 'Draft',
    rating: [4, 5],
  },
  {
    id: '0o02374335',
    name: 'Steel Computer',
    category: 'Games',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/1.webp',
    sku: '78592',
    stock: 0,
    price: '948.00',
    status: 'Publish',
    rating: [4, 5, 8, 5, 3],
  },
];
