export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  urlImage?: string;
  status: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  msg: string;
  data: Category;
}

export interface CategoryListResponse {
  msg: string;
  data: Category[];
}
