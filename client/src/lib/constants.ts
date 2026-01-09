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
      href: "/men",
      featured: [
        { name: "New Arrivals", href: "/men/new" },
        { name: "Best Sellers", href: "/men/best-sellers" },
        { name: "Sale", href: "/men/sale" },
      ],
      categories: [
        {
          title: "Clothing",
          items: [
            { name: "T-Shirts & Tops", href: "/men/t-shirts" },
            { name: "Hoodies & Sweatshirts", href: "/men/hoodies" },
            { name: "Jackets & Coats", href: "/men/jackets" },
            { name: "Pants & Joggers", href: "/men/pants" },
            { name: "Shorts", href: "/men/shorts" },
          ],
        },
        {
          title: "Shoes",
          items: [
            { name: "Sneakers", href: "/men/sneakers" },
            { name: "Running Shoes", href: "/men/running-shoes" },
            { name: "Casual Shoes", href: "/men/casual-shoes" },
            { name: "Sandals & Slides", href: "/men/sandals" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Bags & Backpacks", href: "/men/bags" },
            { name: "Hats & Caps", href: "/men/hats" },
            { name: "Socks", href: "/men/socks" },
            { name: "Watches", href: "/men/watches" },
          ],
        },
      ],
    },
    {
      name: "Women",
      href: "/women",
      featured: [
        { name: "New Arrivals", href: "/women/new" },
        { name: "Best Sellers", href: "/women/best-sellers" },
        { name: "Sale", href: "/women/sale" },
      ],
      categories: [
        {
          title: "Clothing",
          items: [
            { name: "Dresses", href: "/women/dresses" },
            { name: "Tops & Blouses", href: "/women/tops" },
            { name: "Jackets & Coats", href: "/women/jackets" },
            { name: "Pants & Leggings", href: "/women/pants" },
            { name: "Skirts", href: "/women/skirts" },
          ],
        },
        {
          title: "Shoes",
          items: [
            { name: "Sneakers", href: "/women/sneakers" },
            { name: "Heels", href: "/women/heels" },
            { name: "Boots", href: "/women/boots" },
            { name: "Sandals", href: "/women/sandals" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Bags & Purses", href: "/women/bags" },
            { name: "Jewelry", href: "/women/jewelry" },
            { name: "Sunglasses", href: "/women/sunglasses" },
            { name: "Scarves", href: "/women/scarves" },
          ],
        },
      ],
    },
    {
      name: "Kids",
      href: "/kids",
      featured: [
        { name: "New Arrivals", href: "/kids/new" },
        { name: "Best Sellers", href: "/kids/best-sellers" },
      ],
      categories: [
        {
          title: "Boys",
          items: [
            { name: "T-Shirts & Tops", href: "/kids/boys/t-shirts" },
            { name: "Pants & Shorts", href: "/kids/boys/pants" },
            { name: "Shoes", href: "/kids/boys/shoes" },
            { name: "Jackets", href: "/kids/boys/jackets" },
          ],
        },
        {
          title: "Girls",
          items: [
            { name: "Dresses", href: "/kids/girls/dresses" },
            { name: "Tops & Blouses", href: "/kids/girls/tops" },
            { name: "Shoes", href: "/kids/girls/shoes" },
            { name: "Jackets", href: "/kids/girls/jackets" },
          ],
        },
        {
          title: "Baby",
          items: [
            { name: "Bodysuits", href: "/kids/baby/bodysuits" },
            { name: "Sets", href: "/kids/baby/sets" },
            { name: "Shoes", href: "/kids/baby/shoes" },
          ],
        },
      ],
    },
    {
      name: "Sale",
      href: "/sale",
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
