export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeRoomsCount: number;
  rooms: unknown[];
  icon: string
}

export interface PaginatedCategoriesResponse {
  content: Category[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}