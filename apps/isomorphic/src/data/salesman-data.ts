export interface SalesmanDataType {
  id: string | null;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  username: string;
  password: string;
  images: any | null;
  is_active: boolean;
  store_manager?: any | null;
  store?: string | null;
}
