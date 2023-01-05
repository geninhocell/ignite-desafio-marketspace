export interface ProductShowResponseDTO {
  id: string;
  name: string;
  description: string;
  is_new: false;
  price: 450;
  accept_trade: true;
  user_id: string;
  is_active: true;
  created_at: string;
  updated_at: string;
  product_images: {
    path: string;
    id: string;
  }[];
  payment_methods: {
    key: string;
    name: string;
  }[];
  user: {
    avatar: string;
    name: string;
    tel: string;
  };
}
