import React from "react";
import { observer } from "mobx-react";
import Header from "./components/Header";
import BooksTabs from "./components/BooksTabs";
import BooksList from "./components/BooksList";
import AddBookForm from "./components/AddBookForm";

const App = observer(() => (
  <div className="App">
    <Header />
    <main className="app-content">
      <BooksTabs />
      <BooksList />
      <AddBookForm />
    </main>
  </div>
));

export default App;
