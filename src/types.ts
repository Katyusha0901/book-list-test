export interface Book {
  id: string;
  index: number;
  author: string;
  title: string;
  description: string;
  tags: string[];
  moved?: boolean; // true equals book in progress or done
}

export type Tab = "toread" | "done" | "inprogress";
