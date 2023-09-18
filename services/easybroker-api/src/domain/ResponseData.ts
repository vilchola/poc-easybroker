export interface ResponseData<T> {
  pagination: Pagination;
  content: T[];
}

interface Pagination {
  limit: number;
  page: number;
  total: number;
  next_page: string;
}
