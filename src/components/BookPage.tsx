import React from "react";
import { Book, Tab } from "../types";

interface Props {
  tab: Tab;
  book: Book;
  addTag: (tag: string) => void;
  moveBook: (index: number, id: string) => void;
}

export const BookPage: React.FC<Props> = ({ tab, book, addTag, moveBook }) => (
  <div className="book-page" key={book.id}>
    <h3 className="book-page__author">{book.author}</h3>
    <div className="book-page__title-and-button">
      <h2 className="book-page__title">{book.title}</h2>
      {createMoveBookButton(tab, () => moveBook(book.index, book.id))}
    </div>
    <p className="book__description">{book.description}</p>

    {book.tags.map((tag, tagIndex) => (
      <span className="book__tag" key={tagIndex} onClick={() => addTag(tag)}>
        #{tag}
      </span>
    ))}
  </div>
);

function createMoveBookButton(tab: Tab, callback: () => void): JSX.Element {
  if (tab === "toread") {
    return (
      <button className="book__move-button" onClick={callback}>
        <span className="book__move-button-text">start reading</span> →
      </button>
    );
  }

  if (tab === "inprogress") {
    return (
      <button className="book__move-button" onClick={callback}>
        <span className="book__move-button-text">done</span> →
      </button>
    );
  }
  if (tab === "done") {
    return (
      <button className="book__move-button" onClick={callback}>
        <span className="book__move-button-text">to read</span> →
      </button>
    );
  }
}
