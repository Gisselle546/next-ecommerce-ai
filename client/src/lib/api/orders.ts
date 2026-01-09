import type { Order, OrdersResponse, CreateOrderRequest } from "@/types";
import apiClient from "./client";

export const ordersApi = {
  getAll: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await apiClient.get("/orders", {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.post(`/orders/${id}/cancel`);
    return response.data;
  },

  getPaymentIntent: async (
    orderId: string
  ): Promise<{ clientSecret: string }> => {
    const response = await apiClient.post(`/orders/${orderId}/payment-intent`);
    return response.data;
  },
};

export default ordersApi;
