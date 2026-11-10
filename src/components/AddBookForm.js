import React from "react";
import { observer } from "mobx-react";
import booksStore from "../Books/BooksStore";

const AddBookForm = observer(() => (
  <form
    className="add-book-form"
    onSubmit={(event) => {
      event.preventDefault();
      booksStore.addBook();
    }}
  >
    <input
      type="text"
      name="name"
      placeholder="Book name"
      value={booksStore.newBookName}
      onChange={(event) => booksStore.setNewBookName(event.target.value)}
    />
    <input
      type="text"
      name="author"
      placeholder="Author"
      value={booksStore.newBookAuthor}
      onChange={(event) => booksStore.setNewBookAuthor(event.target.value)}
    />
    <button type="submit">Add</button>
  </form>
));

export default AddBookForm;
