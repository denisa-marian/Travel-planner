export type Excursion = {
  id: number;
  name: string;
  price: number;
  duration: number;
  guide: boolean;
  description?: string | null;
  latitude: number;
  longitude: number;
  rating: number;
  reviews_count: number;
  recommended?: boolean;
};
