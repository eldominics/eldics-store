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
