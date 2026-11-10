import React from "react";
import { observer } from "mobx-react";
import booksStore, { TABS } from "../Books/BooksStore";

const BooksTabs = observer(() => (
  <div className="books-tabs" role="tablist">
    <label>
      <input
        type="radio"
        name="books-view"
        checked={booksStore.isAllTab}
        onChange={() => booksStore.setActiveTab(TABS.ALL)}
      />
      All books
    </label>
    <label>
      <input
        type="radio"
        name="books-view"
        checked={booksStore.isPrivateTab}
        onChange={() => booksStore.setActiveTab(TABS.PRIVATE)}
      />
      Private books
    </label>
  </div>
));

export default BooksTabs;
