export interface Images {
  id: string;
  url: string;
  productId: string;
}

export interface Products {
  id?: string;
  nombre: string;
  categoria: string;
  userId?: string;
  images: Images[];
}
