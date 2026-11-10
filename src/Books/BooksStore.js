import { makeAutoObservable, runInAction } from "mobx";
import booksRepository from "./Books.repository";

export const TABS = {
  ALL: "all",
  PRIVATE: "private"
};

export class BooksStore {
  books = [];
  privateBooksCount = 0;
  activeTab = TABS.ALL;
  isLoading = false;
  newBookName = "";
  newBookAuthor = "";

  constructor(repository = booksRepository) {
    this.repository = repository;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isAllTab() {
    return this.activeTab === TABS.ALL;
  }

  get isPrivateTab() {
    return this.activeTab === TABS.PRIVATE;
  }

  get statusMessage() {
    return this.isLoading ? "Loading..." : "";
  }

  setNewBookName(value) {
    this.newBookName = value;
  }

  setNewBookAuthor(value) {
    this.newBookAuthor = value;
  }

  init = async () => {
    await this.loadBooks();
  };

  loadBooks = async () => {
    this.isLoading = true;
    const isPrivate = this.activeTab === TABS.PRIVATE;

    try {
      if (isPrivate) {
        const books = await this.repository.getBooks(true);
        runInAction(() => {
          this.books = books;
          this.privateBooksCount = books.length;
          this.isLoading = false;
        });
        return;
      }

      const [books, privateBooks] = await Promise.all([
        this.repository.getBooks(false),
        this.repository.getBooks(true)
      ]);

      runInAction(() => {
        this.books = books;
        this.privateBooksCount = privateBooks.length;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.books = [];
        this.isLoading = false;
      });
    }
  };

  setActiveTab = async (tab) => {
    if (this.activeTab === tab) {
      return;
    }

    this.activeTab = tab;
    await this.loadBooks();
  };

  addBook = async () => {
    const name = this.newBookName.trim();
    const author = this.newBookAuthor.trim();

    if (!name || !author) {
      return false;
    }

    const success = await this.repository.addBook({ name, author });

    if (success) {
      runInAction(() => {
        this.newBookName = "";
        this.newBookAuthor = "";
      });
      await this.loadBooks();
    }

    return success;
  };
}

const booksStore = new BooksStore();
export default booksStore;
