"use client";

import { useEffect, useState } from 'react';
import apiClient from '@/app/lib/apiClient';


type Product = {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  price: string;
  rating: number[];
};

export function useTopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await apiClient.get('/mingler/admin/dashboard/');
        const apiProducts = response.data.data.top_products.map((product: any, index: number) => ({
          id: index + 1,
          thumbnail: product.product_image || 'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/1.webp',
          title: product.product_name,
          description: 'Product',
          price: `$${product.product_price.toFixed(2)}`,
          rating: [4, 4.5, 5], 
        }));
        setProducts(apiProducts);
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return { products, loading, error };
}