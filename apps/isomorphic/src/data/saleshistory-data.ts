export interface SalesHistoryDataType {
  id: string;
  product_variant: {
    id: string;
    product: string;
    sku: string;
    price: string;
    stock: number;
    attributes: string[];
    images: any[];
  };
  order: string;
  store: {
    id: string;
    name: string;
    address: string;
  };
  sold_by: number;
  sold_by_name: string;
  incentive_amount: string;
  created_at: string;
}
