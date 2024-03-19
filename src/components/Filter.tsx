import React from "react";

interface IProps {
  tags: Set<string>;
  removeTag: (tag: string) => void;
  clearTags: () => void;
}

export const Filter: React.FC<IProps> = ({ tags, removeTag, clearTags }) => {
  if (!tags.size) return null;

  return <div></div>;
};
