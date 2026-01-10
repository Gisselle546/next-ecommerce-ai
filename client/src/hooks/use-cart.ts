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

  // Check if user is authenticated by checking for access token
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('accessToken');

  // Fetch cart from server only if authenticated
  const { data: serverCart, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: cartApi.get,
    enabled: !!isAuthenticated,
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

  const addItem = async (data: AddToCartRequest) => {
    console.log('useCart addItem called with:', data);
    console.log('isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('Adding to cart via API...');
      return addItemMutation.mutateAsync(data);
    } else {
      // For non-authenticated users, use local storage
      console.log('Adding to cart locally...');
      const { addItem: addItemLocal } = useCartStore.getState();
      // Find the product to add
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/products/${data.productId}`);
        const result = await response.json();
        const product = result.data;
        
        // Find variant if variantId is provided
        const variant = data.variantId 
          ? product.variants?.find((v: any) => v.id === data.variantId)
          : undefined;
        
        console.log('Adding to local cart:', { product, variant, quantity: data.quantity });
        addItemLocal(product, variant, data.quantity);
        
        addToast({
          type: "success",
          message: "Added to cart!",
          duration: 3000,
        });
        openCart();
      } catch (error) {
        console.error('Failed to add item:', error);
        addToast({
          type: "error",
          message: "Failed to add item to cart",
          duration: 3000,
        });
      }
    }
  };
  
  const updateItem = (itemId: string, quantity: number) => {
    if (isAuthenticated) {
      return updateItemMutation.mutateAsync({ itemId, data: { quantity } });
    } else {
      const { updateQuantity } = useCartStore.getState();
      updateQuantity(itemId, quantity);
    }
  };
  
  const removeItem = (itemId: string) => {
    if (isAuthenticated) {
      return removeItemMutation.mutateAsync(itemId);
    } else {
      const { removeItem: removeItemLocal } = useCartStore.getState();
      removeItemLocal(itemId);
      addToast({
        type: "success",
        message: "Item removed from cart",
        duration: 3000,
      });
    }
  };
  
  const clearCart = () => {
    if (isAuthenticated) {
      return clearCartMutation.mutateAsync();
    } else {
      const { clearCart: clearCartLocal } = useCartStore.getState();
      clearCartLocal();
    }
  };

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
