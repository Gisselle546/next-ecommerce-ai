"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi } from "@/lib/api";
import { QUERY_KEYS, PAGINATION } from "@/lib/constants";
import type { ProductFilters } from "@/types";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, filters],
    queryFn: () =>
      productsApi.getAll({
        page: filters?.page ?? PAGINATION.DEFAULT_PAGE,
        limit: filters?.limit ?? PAGINATION.DEFAULT_LIMIT,
        ...filters,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(slug),
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "featured", limit],
    queryFn: () => productsApi.getFeatured(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useRelatedProducts(productId: string, limit = 4) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "related", productId, limit],
    queryFn: () => productsApi.getRelated(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useProductSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "search", query, limit],
    queryFn: () => productsApi.search(query, limit),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: categoriesApi.getAll,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY(slug),
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useCategoryProducts(slug: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORY(slug), "products", filters],
    queryFn: () => categoriesApi.getWithProducts(slug, filters),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
