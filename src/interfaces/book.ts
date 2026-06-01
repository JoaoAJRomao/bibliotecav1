export interface BookData {
  id: number;
  title: string;
  author: string;
  year: number;
  publisher: string;
  quantity: number;
  availableCopies?: number;
}

export type NewBook = Omit<BookData, 'id'>;