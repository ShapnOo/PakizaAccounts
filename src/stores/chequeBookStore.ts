import { create } from 'zustand';
import { ChequeBook } from '../types/cheque';
import {
  listChequeBooks,
  createChequeBook,
  updateChequeBook,
  deleteChequeBook,
} from '../services/chequeBookService';

interface ChequeBookState {
  books: ChequeBook[];
  loading: boolean;
  loadBooks: () => Promise<void>;
  addBook: (payload: Omit<ChequeBook, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ChequeBook>;
  editBook: (id: string, patch: Partial<ChequeBook>) => Promise<ChequeBook>;
  removeBook: (id: string) => Promise<void>;
}

export const useChequeBookStore = create<ChequeBookState>((set) => ({
  books: [],
  loading: false,

  loadBooks: async () => {
    set({ loading: true });
    try {
      const data = await listChequeBooks();
      set({ books: data });
    } finally {
      set({ loading: false });
    }
  },

  addBook: async (payload) => {
    const created = await createChequeBook(payload);
    set((state) => ({ books: [created, ...state.books] }));
    return created;
  },

  editBook: async (id, patch) => {
    const updated = await updateChequeBook(id, patch);
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? updated : b)),
    }));
    return updated;
  },

  removeBook: async (id) => {
    await deleteChequeBook(id);
    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
    }));
  },
}));
