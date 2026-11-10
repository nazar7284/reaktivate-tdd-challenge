import { BooksStore, TABS } from "./BooksStore";

const allBooks = [
  { name: "The Hobbit", author: "Jrr Tolkein" },
  { name: "I, Robot", author: "Isaac Asimov" }
];

const privateBooks = [{ name: "The Hobbit", author: "Jrr Tolkein" }];

const createRepository = ({
  all = allBooks,
  priv = privateBooks,
  addResult = true
} = {}) => ({
  getBooks: jest.fn(async (privateOnly) => (privateOnly ? priv : all)),
  addBook: jest.fn(async () => addResult)
});

describe("BooksStore", () => {
  it("loads all books and private count on init", async () => {
    const repository = createRepository();
    const store = new BooksStore(repository);

    await store.init();

    expect(repository.getBooks).toHaveBeenCalledWith(false);
    expect(repository.getBooks).toHaveBeenCalledWith(true);
    expect(store.books).toEqual(allBooks);
    expect(store.privateBooksCount).toBe(1);
    expect(store.isLoading).toBe(false);
    expect(store.isAllTab).toBe(true);
  });

  it("switches to private books and updates the list from the private endpoint", async () => {
    const repository = createRepository();
    const store = new BooksStore(repository);

    await store.init();
    await store.setActiveTab(TABS.PRIVATE);

    expect(store.isPrivateTab).toBe(true);
    expect(store.books).toEqual(privateBooks);
    expect(store.privateBooksCount).toBe(1);
    expect(repository.getBooks).toHaveBeenLastCalledWith(true);
  });

  it("does not reload when the same tab is selected", async () => {
    const repository = createRepository();
    const store = new BooksStore(repository);

    await store.init();
    repository.getBooks.mockClear();

    await store.setActiveTab(TABS.ALL);

    expect(repository.getBooks).not.toHaveBeenCalled();
  });

  it("does not add a book when name or author is empty", async () => {
    const repository = createRepository();
    const store = new BooksStore(repository);
    store.setNewBookName("  ");
    store.setNewBookAuthor("Author");

    const result = await store.addBook();

    expect(result).toBe(false);
    expect(repository.addBook).not.toHaveBeenCalled();
  });

  it("adds a book through the repository, clears the form, and reloads", async () => {
    const repository = createRepository();
    const store = new BooksStore(repository);
    store.setNewBookName(" New Book ");
    store.setNewBookAuthor(" New Author ");

    const result = await store.addBook();

    expect(result).toBe(true);
    expect(repository.addBook).toHaveBeenCalledWith({
      name: "New Book",
      author: "New Author"
    });
    expect(store.newBookName).toBe("");
    expect(store.newBookAuthor).toBe("");
    expect(repository.getBooks).toHaveBeenCalled();
    expect(store.books).toEqual(allBooks);
    expect(store.privateBooksCount).toBe(1);
  });

  it("keeps form values and does not reload when add fails", async () => {
    const repository = createRepository({ addResult: false });
    const store = new BooksStore(repository);
    store.setNewBookName("New Book");
    store.setNewBookAuthor("New Author");

    const result = await store.addBook();

    expect(result).toBe(false);
    expect(store.newBookName).toBe("New Book");
    expect(store.newBookAuthor).toBe("New Author");
    expect(repository.getBooks).not.toHaveBeenCalled();
  });

  it("clears the list and stops loading when the repository throws", async () => {
    const repository = {
      getBooks: jest.fn(async () => {
        throw new Error("network");
      }),
      addBook: jest.fn()
    };
    const store = new BooksStore(repository);

    await store.loadBooks();

    expect(store.books).toEqual([]);
    expect(store.isLoading).toBe(false);
  });
});
