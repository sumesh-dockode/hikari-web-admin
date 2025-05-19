interface StoreManager {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  username: string;
}

interface Store {
  id: string | null;
  name: string;
  address: string;
}
export interface SalesmanDataType {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  username: string;
  password?: string;
  is_active: boolean;
  store_manager?: StoreManager | null;
  store?: Store | null;
  store_manager_id?: number | null;
}
