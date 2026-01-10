export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const ROUTES = {
  HOME: "/",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Main Navigation Categories
  MEN: "/men",
  WOMEN: "/women",
  KIDS: "/kids",
  SALE: "/sale",

  // Products
  PRODUCTS: "/products",
  PRODUCT: (slug: string) => `/products/${slug}`,

  // Categories
  CATEGORIES: "/categories",
  CATEGORY: (slug: string) => `/categories/${slug}`,

  // Cart & Checkout
  CART: "/cart",
  CHECKOUT: "/checkout",

  // Account
  ACCOUNT: "/account",
  ORDERS: "/account/orders",
  ORDER: (id: string) => `/account/orders/${id}`,
  SETTINGS: "/account/settings",
} as const;

export const NAVIGATION = {
  main: [
    {
      name: "Men",
      href: "/categories/men",
      featured: [
        { name: "New Arrivals", href: "/categories/men?sort=newest" },
        { name: "Best Sellers", href: "/categories/men?sort=popular" },
        { name: "Sale", href: "/categories/men?sale=true" },
      ],
      categories: [
        {
          title: "Clothing",
          items: [
            { name: "T-Shirts & Tops", href: "/categories/men-tshirts" },
            { name: "Hoodies & Sweatshirts", href: "/categories/men-hoodies" },
            { name: "Jackets & Coats", href: "/categories/men-jackets" },
            { name: "Pants & Joggers", href: "/categories/men-pants" },
            { name: "Shorts", href: "/categories/men-shorts" },
          ],
        },
        {
          title: "Shoes",
          items: [
            { name: "Sneakers", href: "/categories/men-sneakers" },
            { name: "Running Shoes", href: "/categories/men-running-shoes" },
            { name: "Casual Shoes", href: "/categories/men-casual-shoes" },
            { name: "Sandals & Slides", href: "/categories/men-sandals" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Bags & Backpacks", href: "/categories/men-bags" },
            { name: "Hats & Caps", href: "/categories/men-hats" },
            { name: "Socks", href: "/categories/men-socks" },
            { name: "Watches", href: "/categories/men-watches" },
          ],
        },
      ],
    },
    {
      name: "Women",
      href: "/categories/women",
      featured: [
        { name: "New Arrivals", href: "/categories/women?sort=newest" },
        { name: "Best Sellers", href: "/categories/women?sort=popular" },
        { name: "Sale", href: "/categories/women?sale=true" },
      ],
      categories: [
        {
          title: "Clothing",
          items: [
            { name: "Dresses", href: "/categories/women-dresses" },
            { name: "Tops & Blouses", href: "/categories/women-tops" },
            { name: "Jackets & Coats", href: "/categories/women-jackets" },
            { name: "Pants & Leggings", href: "/categories/women-pants" },
            { name: "Skirts", href: "/categories/women-skirts" },
          ],
        },
        {
          title: "Shoes",
          items: [
            { name: "Sneakers", href: "/categories/women-sneakers" },
            { name: "Heels", href: "/categories/women-heels" },
            { name: "Boots", href: "/categories/women-boots" },
            { name: "Sandals", href: "/categories/women-sandals" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Bags & Purses", href: "/categories/women-bags" },
            { name: "Jewelry", href: "/categories/women-jewelry" },
            { name: "Sunglasses", href: "/categories/women-sunglasses" },
            { name: "Scarves", href: "/categories/women-scarves" },
          ],
        },
      ],
    },
    {
      name: "Kids",
      href: "/categories/kids",
      featured: [
        { name: "New Arrivals", href: "/categories/kids?sort=newest" },
        { name: "Best Sellers", href: "/categories/kids?sort=popular" },
      ],
      categories: [
        {
          title: "Boys",
          items: [
            { name: "T-Shirts & Tops", href: "/categories/boys-tshirts" },
            { name: "Pants & Shorts", href: "/categories/boys-pants" },
            { name: "Shoes", href: "/categories/boys-shoes" },
            { name: "Jackets", href: "/categories/boys-jackets" },
          ],
        },
        {
          title: "Girls",
          items: [
            { name: "Dresses", href: "/categories/girls-dresses" },
            { name: "Tops & Blouses", href: "/categories/girls-tops" },
            { name: "Shoes", href: "/categories/girls-shoes" },
            { name: "Jackets", href: "/categories/girls-jackets" },
          ],
        },
        {
          title: "Baby",
          items: [
            { name: "Bodysuits", href: "/categories/baby-bodysuits" },
            { name: "Sets", href: "/categories/baby-sets" },
            { name: "Shoes", href: "/categories/baby-shoes" },
          ],
        },
      ],
    },
    {
      name: "Sale",
      href: "/products?sale=true",
      highlight: true,
    },
  ],
} as const;

export const QUERY_KEYS = {
  USER: ["user"],
  PRODUCTS: ["products"],
  PRODUCT: (slug: string) => ["product", slug],
  CATEGORIES: ["categories"],
  CATEGORY: (slug: string) => ["category", slug],
  CART: ["cart"],
  ORDERS: ["orders"],
  ORDER: (id: string) => ["order", id],
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  CART_ID: "cartId",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
} as const;
