export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images: {
    id: string;
    path: string;
  }[];
  payment_methods: {
    key: string;
    name: string;
  }[];
}
