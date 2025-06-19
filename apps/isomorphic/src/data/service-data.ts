export interface serviceDataType {
  id: string;
  service_to: string;
  service_type: string;
  user_id: number;
  description: string;
  image: string;
  price: string;
  status: string;
  product?: {
    id: string;
    name: string;
  };
  requested_by?: {
    first_name: string;
    last_name: string;
  };
   service_images: Array<{
    id: string;
    image: string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface serviceStatusChangeDataType {
  id?: any;
  status?: string;
    new_status: string;
    new_price: string;
    // service_type_id: string;
    // image: any
  };
