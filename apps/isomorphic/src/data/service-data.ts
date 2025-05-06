export interface OrdersDataType {
    id: string;
    items: [];
    total_price: string;
    status: string;
    created_at: string;
    user?: number;
  }
  
  export interface serviceStatusChangeDataType {
    id: string;
    status: string;
  }