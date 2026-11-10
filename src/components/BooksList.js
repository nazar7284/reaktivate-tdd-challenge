import React from "react";
import { observer } from "mobx-react";
import booksStore from "../Books/BooksStore";

const BooksList = observer(() => (
  <div className="books-list">
    <div>{booksStore.statusMessage}</div>
    {booksStore.books.map((book, i) => (
      <div key={book.id || i}>
        {book.author}: {book.name}
      </div>
    ))}
  </div>
));

export default BooksList;
