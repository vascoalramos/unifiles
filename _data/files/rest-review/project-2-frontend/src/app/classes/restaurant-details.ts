import {Owner} from './owner';
import {Review} from './review';

export class RestaurantDetails {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  phone_number: string;
  photo: string;
  latitude: number;
  longitude: number;
  avg_score: number;
  n_of_reviews: number;
  is_favorite: boolean;
  owner: Owner;
  description: string;
  reviews: Review[];
}
