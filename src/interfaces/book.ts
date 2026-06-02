export interface BookData {
  id: number;
  title: string;
  author: string;
  year: number;
  publisher: string;
  quantity: number;
  availableCopies?: number;
  isbn?: string;
  imageUrl?: string;
}

export type NewBook = Omit<BookData, 'id'>;