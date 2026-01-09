"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api";
import { useCartStore, useUIStore } from "@/stores";
import { QUERY_KEYS } from "@/lib/constants";
import type { AddToCartRequest, UpdateCartItemRequest } from "@/types";

export function useCart() {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    itemCount,
    subtotal,
  } = useCartStore();

  // Fetch cart from server
  const { data: serverCart, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: cartApi.get,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      addToast({
        type: "success",
        message: "Added to cart!",
        duration: 3000,
      });
      openCart();
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Failed to add item to cart",
        duration: 3000,
      });
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: UpdateCartItemRequest;
    }) => cartApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Failed to update cart",
        duration: 3000,
      });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      addToast({
        type: "success",
        message: "Item removed from cart",
        duration: 3000,
      });
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Failed to remove item",
        duration: 3000,
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });

  const addItem = (data: AddToCartRequest) => addItemMutation.mutateAsync(data);
  const updateItem = (itemId: string, quantity: number) =>
    updateItemMutation.mutateAsync({ itemId, data: { quantity } });
  const removeItem = (itemId: string) => removeItemMutation.mutateAsync(itemId);
  const clearCart = () => clearCartMutation.mutateAsync();

  return {
    // State
    items: serverCart?.items ?? items,
    isOpen,
    isLoading,
    itemCount: serverCart?.itemCount ?? itemCount(),
    subtotal: serverCart?.subtotal ?? subtotal(),
    total: serverCart?.total ?? subtotal(),
    tax: serverCart?.tax ?? 0,
    shipping: serverCart?.shipping ?? 0,

    // Actions
    addItem,
    updateItem,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,

    // Mutation states
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  };
}

export default useCart;
