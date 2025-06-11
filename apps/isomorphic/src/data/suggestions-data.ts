export type SuggestionsDataType = {
  created_at: string;
  updated_at: string;
  review: string;
  rating: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
};
