export interface BookData {
  id: number;
  title: string;
  author: string;
  year: number;
  publisher: string;
  totalQuantity: number;
  availableQuantity: number;
}

export type NewBook = Omit<BookData, 'id'>;