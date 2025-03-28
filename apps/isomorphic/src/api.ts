export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  login: `${API_BASE_URL}/authentication/login/`,
  categories: `${API_BASE_URL}/categories/admin/category/`,
};
