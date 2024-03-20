export interface Book {
  id: string;
  index: number;
  author: string;
  title: string;
  description: string;
  tags: string[];
  moved?: boolean;
}

export type Tab = "toread" | "done" | "inprogress";
