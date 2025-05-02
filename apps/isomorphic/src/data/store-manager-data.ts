export interface StoreManagerDataType {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  username: string;
  password: string;
  images: any | null;
  is_active: boolean;
  store_name: string;
  store_address: string;
}
