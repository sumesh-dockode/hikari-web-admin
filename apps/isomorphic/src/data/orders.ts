export interface OrdersDataType {
  id: string;
  items: [];
  total_price: string;
  status: string;
  created_at: string;
  user?: number;
  order_info?: {
    name: string;
    address: string;
  };
  assigned_to: number | null;
}

export interface OrderStatusChangeDataType {
  id: string;
  status: string;
}