import React from "react";

interface IProps {
  tags: Set<string>;
  removeTag: (tag: string) => void;
  clearTags: () => void;
}

export function Filter() {
  return <div></div>;
}
