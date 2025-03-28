export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeRoomsCount: number;
  rooms: any[];
  icon: string
}

export interface PaginatedCategoriesResponse {
  totalPages: number;
  categories: Category[];
  current_page: number;
  totalElements: number;
}