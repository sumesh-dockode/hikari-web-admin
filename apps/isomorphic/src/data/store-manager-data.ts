export interface StoreManagerDataType {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  username: string;
  password?: string;
  is_active: boolean;
  store_name: string;
  store_address: string;
  store_info?: {
    id: string;
    name: string;
    address: string;
  };
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
  store_info: { name: string; address: string } | null;
}