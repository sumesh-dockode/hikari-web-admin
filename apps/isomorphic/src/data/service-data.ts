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
  id: string;
  status: string;
  user_id: number;
}
