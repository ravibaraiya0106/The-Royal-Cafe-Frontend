export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  ITEMS: {
    GET_ALL: "/product/list",
    GET_BY_ID: (id: string) => `/product/${id}`,
    CREATE: "/product/create",
    UPDATE: (id: string) => `/product/update/${id}`,
    DELETE: (id: string) => `/product/delete/${id}`,
    CATEGORY_DROPDOWN: "/category/dropdown",
  },
  CATEGORIES: {
    GET_ALL: "/category/list",
    GET_BY_ID: (id: string) => `/category/${id}`,
    CREATE: "/category/create",
    UPDATE: (id: string) => `/category/update/${id}`,
    DELETE: (id: string) => `/category/delete/${id}`,
  },
  CUSTOMERS: {
    GET_ALL: "/user/list",
    DELETE: (id: string) => `/user/delete/${id}`,
  },
  CONTACTS: {
    GET_ALL: "/contact/list",
    GET_BY_ID: (id: string) => `/contact/${id}`,
    DELETE: (id: string) => `/contact/delete/${id}`,
    REPLY: (id: string) => `/contact/reply/${id}`,
  },
  REVIEWS: {
    GET_ALL: "/review/list",
    GET_BY_ID: (id: string) => `/review/${id}`,
    DELETE: (id: string) => `/review/delete/${id}`,
  },
  COUPONS: {
    GET_ALL: "/coupon/list",
    GET_BY_ID: (id: string) => `/coupon/${id}`,
    CREATE: "/coupon/create",
    UPDATE: (id: string) => `/coupon/update/${id}`,
    DELETE: (id: string) => `/coupon/delete/${id}`,
  },
  DELIVERY_PERSON: {
    GET_ALL: "/delivery-person/list",
    GET_BY_ID: (id: string) => `/delivery-person/${id}`,
    CREATE: "/delivery-person/create",
    UPDATE: (id: string) => `/delivery-person/update/${id}`,
    DELETE: (id: string) => `/delivery-person/delete/${id}`,
  },
  BLOG: {
    GET_ALL: "/blog/list",
    GET_BY_ID: (id: string) => `/blog/${id}`,
    CREATE: "/blog/create",
    UPDATE: (id: string) => `/blog/update/${id}`,
    DELETE: (id: string) => `/blog/delete/${id}`,
  },
};
