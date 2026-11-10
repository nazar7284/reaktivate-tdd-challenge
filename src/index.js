import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import booksStore from "./Books/BooksStore";
import "./styles.css";

booksStore.init();

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
