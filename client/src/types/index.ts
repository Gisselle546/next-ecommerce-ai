export * from "./auth";
export * from "./product";
export * from "./cart";
export * from "./order";

// Common types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
