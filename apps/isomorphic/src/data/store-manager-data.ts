export interface StoreManagerDataType {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  username: string;
  password: string;
  is_active: boolean;
  store_name: string;
  store_address: string;
}

export interface StoreManagerTableDataType {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  username: string;
  password: string;
  is_active: boolean;
  store_info: { store_name: string; store_address: string } | null;
}