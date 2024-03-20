import React from "react";
import { Book, Tab } from "../types";

interface Props {
  tab: Tab;
  books: Book[];
  tags: Set<string>;
  moveBook: (index: number, id: string) => void;
  booksInProgressIds: Set<string>;
  booksDoneIds: Set<string>;
}

interface State {
  countToDisplay: number;
}

export class Books extends React.Component<Props, State> {
  booksRef = React.createRef<HTMLDivElement>();
  filteredBooksCount = 0;

  state = {
    countToDisplay: 50,
  };

  componentDidMount() {
    window.onscroll = () => {
      const books = this.booksRef.current as unknown as HTMLElement;

      if (books) {
        const toBooksBottom =
          books.getBoundingClientRect().bottom - window.innerHeight;
        if (
          toBooksBottom < 200 &&
          this.filteredBooksCount > this.state.countToDisplay
        ) {
          this.setState({ countToDisplay: this.state.countToDisplay + 50 });
        }
      }
    };
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  filterBooks = (): Book[] => {
    const { tab, books, tags, booksInProgressIds, booksDoneIds } = this.props;
    return books.filter(
      (book) =>
        ((tab === "toread" && !book.moved) ||
          (tab === "inprogress" && booksInProgressIds.has(book.id)) ||
          (tab === "done" && booksDoneIds.has(book.id))) &&
        (!tags.size || Array.from(tags).every((tag) => book.tags.includes(tag)))
    );
  };

  
}
