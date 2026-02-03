import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TableConfig } from '../ecommerce/product/shared/shared-types';

interface UseBaseProductDataOptions {
  config: TableConfig;
  currentPage: number;
  currentPageSize: number;
  enabled?: boolean;
}

export function useBaseProductData({
  config,
  currentPage,
  currentPageSize,
  enabled = true,
}: UseBaseProductDataOptions) {
  const { data: queryData, isLoading, error, refetch } = useQuery<any>({
    queryKey: ['baseProductTable', config.apiEndpoint, currentPage, currentPageSize],
    queryFn: async () => {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('No access token');

      const res = await fetch(
        `${config.apiEndpoint}?page=${currentPage}&page_size=${currentPageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch products');

      return await res.json();
    },
    enabled: enabled && typeof window !== 'undefined',
  });

  // Memoize formatted data to prevent infinite loops
  const formattedData = useMemo(() => {
    return queryData ? config.dataTransformer(queryData) : [];
  }, [queryData, config.dataTransformer]);
  
  const totalPages = useMemo(() => {
    if (!queryData) return -1;
    
    if (config.pageCountExtractor) {
      return config.pageCountExtractor(queryData) || -1;
    }
    
    // Try both response structures
    // Structure 1: { total_pages: 5, results: [...] }
    // Structure 2: { data: { total_pages: 5, results: [...] } }
    return queryData?.total_pages || queryData?.data?.total_pages || -1;
  }, [queryData, config.pageCountExtractor]);

  return {
    data: formattedData,
    rawData: queryData,
    totalPages,
    isLoading,
    error,
    refetch,
  };
}
