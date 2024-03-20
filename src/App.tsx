import React from "react";
import "./App.css";
import { Book, Tab } from "./types";
import { Books } from "./components/Books";
import { Filter } from "./components/Filter";
import { Header } from "./components/Header";

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
    fetch("book-list-test/data/30000-items.json")
      .then((response) => response.json())
      .then((data) => {
        data.items.forEach((book: Book, index: number) => (book.index = index));

        const allBooks: Book[] = data.items;
        if (!localStorage.getItem("movedBooks")) {
          localStorage.setItem("movedBooks", "[]");
        }
        const movedBookIds: string[] = JSON.parse(
          localStorage.getItem("movedBooks") as string
        );
        for (let movedId of movedBookIds) {
          const book = allBooks.find((book) => book.id === movedId);
          if (book) book.moved = true;
        }

        this.setState({ allBooks });
      })
      .catch((err) => console.log("Ошибка", err));

    const newUrl = new URL(window.location.href);
    newUrl.search = "";
    const urlParams = new URLSearchParams(window.location.search);

    const tab = urlParams.get("tab");
    if (tab === "toread" || tab === "inprogress" || tab === "done") {
      newUrl.searchParams.set("tab", tab);
      this.setState({ currentTab: tab });
    }

    const tags = urlParams.get("tags");
    if (tags) {
      newUrl.searchParams.set("tags", tags);
      this.setState({ tags: new Set(tags.split(",")) });
    }

    window.history.pushState("", "", newUrl.toString());

    if (!localStorage.getItem("booksInProgress")) {
      localStorage.setItem("booksInProgress", "[]");
    }
    const storedBooksInProgress: string[] = JSON.parse(
      localStorage.getItem("booksInProgress") as string
    );
    this.setState({ booksInProgressIds: new Set(storedBooksInProgress) });

    if (!localStorage.getItem("booksDone")) {
      localStorage.setItem("booksDone", "[]");
    }
    const storedBooksDone: string[] = JSON.parse(
      localStorage.getItem("booksDone") as string
    );
    this.setState({ booksDoneIds: new Set(storedBooksDone) });
  }

  changeTab = (tab: Tab) => {
    this.setState({ currentTab: tab });

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", tab);
    window.history.pushState("", "", newUrl.toString());
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addTag = (tag: string) => {
    let tags = this.state.tags;
    tags.add(tag);
    this.setState({ tags });

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tags", Array.from(tags).join(","));
    window.history.pushState("", "", newUrl.toString());
  };

  removeTag = (tag: string) => {
    let tags = this.state.tags;
    tags.delete(tag);
    this.setState({ tags });

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tags", Array.from(tags).join(","));
    window.history.pushState("", "", newUrl.toString());
  };

  clearTags = () => {
    this.setState({ tags: new Set() });

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("tags");
    window.history.pushState("", "", newUrl.toString());
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  startBook = (index: number, id: string) => {
    const allBooks = this.state.allBooks;
    allBooks[index].moved = true;
    const movedBooks = allBooks.filter((book) => book.moved);
    const movedBooksIds = movedBooks.map((book) => book.id);
    localStorage.setItem("movedBooks", JSON.stringify(movedBooksIds));

    const booksInProgressIds = this.state.booksInProgressIds;
    booksInProgressIds.add(id);
    localStorage.setItem(
      "booksInProgress",
      JSON.stringify(Array.from(booksInProgressIds))
    );

    this.setState({ allBooks, booksInProgressIds });
  };

  finishBook = (index: number, id: string) => {
    const booksInProgressIds = this.state.booksInProgressIds;
    booksInProgressIds.delete(id);
    localStorage.setItem(
      "booksInProgress",
      JSON.stringify(Array.from(booksInProgressIds))
    );

    const booksDoneIds = this.state.booksDoneIds;
    booksDoneIds.add(id);
    localStorage.setItem("booksDone", JSON.stringify(Array.from(booksDoneIds)));

    this.setState({ booksInProgressIds, booksDoneIds });
  };

  resetBook = (index: number, id: string) => {
    const booksDoneIds = this.state.booksDoneIds;
    booksDoneIds.delete(id);
    localStorage.setItem("booksDone", JSON.stringify(Array.from(booksDoneIds)));

    const allBooks = this.state.allBooks;
    allBooks[index].moved = false;
    const movedBooks = allBooks.filter((book) => book.moved);
    const movedBooksIds = movedBooks.map((book) => book.id);
    localStorage.setItem("movedBooks", JSON.stringify(movedBooksIds));

    this.setState({ booksDoneIds, allBooks });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    const { currentTab, allBooks, booksInProgressIds, booksDoneIds, tags } =
      this.state;
    const toReadCount = allBooks.filter((book) => !book.moved).length;
    const inProgressCount = booksInProgressIds.size;
    const doneCount = booksDoneIds.size;

    let moveBook = this.startBook;
    if (currentTab === "inprogress") {
      moveBook = this.finishBook;
    }
    if (currentTab === "done") {
      moveBook = this.resetBook;
    }

    return (
      <div className="app">
        <Header
          currentTab={currentTab}
          changeTab={this.changeTab}
          toRead={toReadCount}
          inProgress={inProgressCount}
          done={doneCount}
        />
        <Filter
          tags={tags}
          removeTag={this.removeTag}
          clearTags={this.clearTags}
        />
        <Books
          tab={currentTab}
          books={allBooks}
          tags={tags}
          addTag={this.addTag}
          moveBook={moveBook}
          booksInProgressIds={booksInProgressIds}
          booksDoneIds={booksDoneIds}
        />
      </div>
    );
  }
}
