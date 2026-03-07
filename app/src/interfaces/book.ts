export interface BookData {
  id: number;
  title: string;
  author: string;
  year: number;
  publisher: string;
}

export type NewBook = Omit<BookData, 'id'>;