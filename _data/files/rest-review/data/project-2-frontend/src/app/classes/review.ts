import {Client} from './client';
import {Restaurant} from './restaurant';

export class Review {
  client: Client;
  restaurant: Restaurant[];
  title: string;
  comment: string;
  stars: number;
  price: number;
  quality: number;
  cleanliness: number;
  speed: number;
  timestamp: Date;
}
