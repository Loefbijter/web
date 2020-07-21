export interface Paged<T> {
  itemCount: number;
  totalItems: number;
  pageCount: number;
  next: string;
  previous: string;
  items: T[];
}
