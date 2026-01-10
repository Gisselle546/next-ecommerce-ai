import type {
  Product,
  ProductsResponse,
  ProductFilters,
  Category,
} from "@/types";
import apiClient from "./client";

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const response = await apiClient.get("/products", { params: filters });
    return response.data.data; // Backend wraps in {data: {...}}
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },

  getFeatured: async (limit = 8): Promise<Product[]> => {
    const response = await apiClient.get("/products/featured", {
      params: { limit },
    });
    return response.data.data;
  },

  getRelated: async (productId: string, limit = 4): Promise<Product[]> => {
    const response = await apiClient.get(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data.data;
  },

  search: async (query: string, limit = 10): Promise<Product[]> => {
    const response = await apiClient.get("/products/search", {
      params: { q: query, limit },
    });
    return response.data.data;
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get("/categories");
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data.data;
  },

  getWithProducts: async (
    slug: string,
    filters?: ProductFilters
  ): Promise<{ category: Category; products: ProductsResponse }> => {
    const response = await apiClient.get(`/categories/slug/${slug}/products`, {
      params: filters,
    });
    return response.data.data;
  },
};

export default productsApi;
