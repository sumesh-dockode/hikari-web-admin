export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  login: `${API_BASE_URL}/authentication/login/`,
  categories: `${API_BASE_URL}/categories/admin/category/`,
  products: `${API_BASE_URL}/ecom/admin/products/`,
  variants: `${API_BASE_URL}/ecom/admin/product-attributes/`,
  variantValues: `${API_BASE_URL}/ecom/admin/product-attribute-values/`,
  
};
