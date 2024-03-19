import React from "react";
import "./App.css";
import { Book, Tab } from "./types";
import { Books } from "./components/Books";
import { Filter } from "./components/Filter";
import { Header } from "./components/Header";
import { BookPage } from "./components/BookPage";

interface State {
  allBooks: Book[];
  booksInProgressIds: Set<string>;
  booksDoneIds: Set<string>;
  currentTab: Tab;
  tags: Set<string>;
}

export class App extends React.Component<{}, State> {
  state: State = {
    allBooks: [],
    booksInProgressIds: new Set(),
    booksDoneIds: new Set(),
    currentTab: "toread" as Tab,
    tags: new Set(),
  };

  componentDidMount() {
    fetch("../public/data/10-items.json")
      .then((response) => response.json())
      .then((data) => {
        data.items.forEach((book: Book, index: number) => (book.index = index));
        const allBooks: Book[] = data.items;
        if (!localStorage.getItem("moveBooks")) {
          localStorage.setItem("moveBooks", "[]");
        }
        const movedBookIds: string[] = JSON.parse(
          localStorage.getItem("moveBooks") as string
        );
        for (let movedId of movedBookIds) {
          const book = allBooks.find((book) => book.id === movedId);
          if (book) book.moved = true;
        }

        this.setState({ allBooks });
      });

    const newUrl = new URL(window.location.href);
    newUrl.search = "";
    const urlParams = new URLSearchParams(window.location.search);

    const tab = urlParams.get("tab");
    if (tab === "toread" || tab === "inprogress" || tab === "done") {
      newUrl.searchParams.set("tab", tab);
      this.setState({ currentTab: tab });
    }
  }

  changeTab = (tab: Tab) => {
    this.setState({ currentTab: tab });

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", tab);
    window.history.pushState("", "", newUrl.toString());
  };

  render() {
    const { currentTab } = this.state;
    return (
      <div className="app">
        <Header currentTab={currentTab} changeTab={this.changeTab} />
        <Filter />
        <Books />
      </div>
    );
  }
}
