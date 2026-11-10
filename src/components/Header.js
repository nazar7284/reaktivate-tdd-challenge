import React from "react";
import { observer } from "mobx-react";
import booksStore from "../Books/BooksStore";

const Header = observer(() => (
  <header className="app-header">
    Your books: {booksStore.privateBooksCount}
  </header>
));

export default Header;
