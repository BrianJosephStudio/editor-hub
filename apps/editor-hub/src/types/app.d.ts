import { Metadata } from "./dropbox";

export interface FileTreeNode {
  name: string;
  tag: "file" | "folder";
  path: string;
  metadata?: Metadata;
  tagList?: string[]
  children?: FileTreeNode[];
  temporary_link?: string;
}
