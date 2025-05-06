export interface OrdersDataType {
  id: string;
  items: [];
  total_price: string;
  status: string;
  created_at: string;
  user?: number;
}

export interface OrderStatusChangeDataType {
  id: string;
  status: string;
}