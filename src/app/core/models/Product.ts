export interface ProductImage {
  _id?: string;
  url: string;
  isMain: boolean;
}

export interface Product {
  _id?: string;
  referenceCode: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: any;
  status: boolean;
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  msg: string;
  data: Product;
}

export interface ProductListResponse {
  msg: string;
  data: Product[];
}
