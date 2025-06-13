export interface PromotionDataType {
  id: string;
  store_manager?: number;
  product?: string;
  promotion_medium?: string;
  aspect_ratio?: string;
  area_latitude?: string;
  area_longitude?: string;
  location?: string;
  comments?: string;
  promotion_image: string | null;
  promotion_document: string | null;
  product_name?: string;
}
