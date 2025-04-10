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
  _embedded: {
    categoriesDtoList: Category[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}