export type ProductType = {
  is_published?: any;
  metaltype?: string;
  id: string;
  username?: string;
  name: string;
  category: string;
  image?: string | null;
  sku?: string;
  stock?: number;
  price?: string;
  status?: string;
  barcode?: string;
  rating?: number[];
  grossweight?: number;
  diamondnumbers?: number;
  colourstoneweight?: number;
  role?: string;
  company?: string;
  colourstonenumber?: number;
  metal?: string;
  product_images?: any;
  description?: string;
  count?: string | number;
  time?: string | number;
  attachment?: string | null;
};

export interface TableConfig<T = ProductType> {
  apiEndpoint: string;
  dataTransformer: (apiResponse: any) => T[];
  pageCountExtractor?: (apiResponse: any) => number;
}

export interface CustomActions<T = ProductType> {
  handleEditRow?: (row: T) => void;
  handleDeleteRow?: (row: T) => Promise<void>;
  handleDownloadRow?: (row: T) => void;
  handleRetryDownloadRow?: (row: T) => Promise<void>;
}
