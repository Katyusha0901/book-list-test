import React from "react";
import "./App.css";
import { Book, Tab } from "./types";
import { Books } from "./components/Books";
import { Filter } from "./components/Filter";
import { Header } from "./components/Header";
import { BookPage } from "./components/BookPage";

interface State {}

export function App() {
  return (
    <div className="app">
      <Header />
      <Filter />
      <Books />
    </div>
  );
}
