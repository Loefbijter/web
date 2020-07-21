export interface News {
  id: string;
  title: string;
  text: string;
  image?: string;
  createdAt: number;
  updatedAt: number;
  publishedAt: number;
}

export interface PostNewsDto {
  title: string;
  text: string;
  image?: string;
  publishedAt?: number;
}
