export interface serviceDataType {
  id: string;
  service_to: string;
  service_type: string;
  user_id: number;
  description: string;
  image: string;
  price: string;
  status: string;
}

export interface serviceStatusChangeDataType {
  id?: any;
  status?: string;
    new_status: string;
    new_price: string;
    // service_type_id: string;
    // image: any
  };
