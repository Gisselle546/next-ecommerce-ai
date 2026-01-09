import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "@/types";
import apiClient from "./client";

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get("/cart");
    return response.data;
  },

  addItem: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post("/cart/items", data);
    return response.data;
  },

  updateItem: async (
    itemId: string,
    data: UpdateCartItemRequest
  ): Promise<Cart> => {
    const response = await apiClient.patch(`/cart/items/${itemId}`, data);
    return response.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clear: async (): Promise<Cart> => {
    const response = await apiClient.delete("/cart");
    return response.data;
  },

  applyCoupon: async (code: string): Promise<Cart> => {
    const response = await apiClient.post("/cart/coupon", { code });
    return response.data;
  },

  removeCoupon: async (): Promise<Cart> => {
    const response = await apiClient.delete("/cart/coupon");
    return response.data;
  },
};

export default cartApi;
