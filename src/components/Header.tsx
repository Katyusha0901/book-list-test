import React from "react";
import { Tab } from "../types";
import "./Header.css";

interface Props {
  currentTab: Tab;
  changeTab: (tab: Tab) => void;
  toRead: number;
  //   inProgress: number;
  //   done: number;
}

export const Header: React.FC<Props> = ({ currentTab, changeTab, toRead }) => {
  const toReadClassName =
    "navbar__item" + (currentTab === "toread" ? " navbar__item_active" : "");
  const inProgressClassName =
    "navbar__item" +
    (currentTab === "inprogress" ? " navbar__item_active" : "");
  const doneClassName =
    "navbar__item" + (currentTab === "done" ? " navbar__item_active" : "");

  return (
    <nav className="navbar">
      <div className={toReadClassName} onClick={() => changeTab("toread")}>
        To read <span className="navbar__count">({toRead})</span>
      </div>
      <div
        className={inProgressClassName}
        onClick={() => changeTab("inprogress")}
      >
        In progress <span className="navbar__count"></span>
      </div>
      <div className={doneClassName} onClick={() => changeTab("done")}>
        Done <span className="navbar__count"></span>
      </div>
    </nav>
  );
};
