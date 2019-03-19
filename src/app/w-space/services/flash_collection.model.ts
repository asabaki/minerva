export interface FlashModel {
  _id: string;
  author: string;
  title: string;
  description: string;
  card: Array<Object>;
  user_id: string;
  updatedAt: Date;
  privacy: boolean;
  views: number;
  rating: number;
}
