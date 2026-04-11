export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
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
};
