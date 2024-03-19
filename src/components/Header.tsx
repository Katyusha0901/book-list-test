import React from "react";
import { Tab } from "../types";

interface Props {
  currentTab: Tab;
  //   changeTab: (tab: Tab) => void;
  //   toRead: number;
  //   inProgress: number;
  //   done: number;
}

export const Header: React.FC<Props> = ({ currentTab }) => {
  return (
    <nav className="navbar">
      <div></div>
    </nav>
  );
};
