export interface ProductParams {
  id: string;
  author_id: string;
  sizes: string[];
  colors: string[];
  styles: string[];
  brand: string;
  status: string;
  image_url_array: string[];
  videos_url_array: string[];
  name: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  description: string;
  discount: number;
  quantity: number;
  product_shipping_fee: number;
  offer_price: number;
  created_at: Date;
  updated_at: Date;
  location: string;
  product_comment: string;
}

export interface AddressParams {
  id: string; // UUID
  user_id: string; // UUID (FK to auth.users)
  title?: string | null;
  region?: string; // default: 'Nigeria'
  address?: string | null;
  state?: string | null;
  city?: string | null;
  phone?: string | null;
  country_code?: string | null;
  flag?: string | null;
  is_default?: boolean; // default: false
  created_at?: string; // ISO timestamp
}

export type OrderStatus =
  | "processing"
  | "completed"
  | "cancelled"
  | "shipped"
  | "delivered"
  | "returned"
  | "waiting"
  | "reviewed";

export interface OrderParams {
  id: string; // UUID
  user_id: string; // UUID
  user_email?: string | null;
  product_name: string;
  product_category?: string | null;
  amount_paid: number; // NUMERIC(10,2)
  quantity_bought: number;
  image_url: string;
  status: OrderStatus;
  size?: string | null;
  color?: string | null;
  region?: string | null;
  state?: string | null;
  city?: string | null;
  address: string;
  phone: string;
  reference_paystack: string;
  country_code?: string | null;
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}
