import { Metadata } from "./dropbox";
import { TagObject } from "./tags";

export interface FileTreeNode {
  name: string;
  tag: "file" | "folder";
  path: string;
  filtered: boolean
  metadata?: Metadata;
  tagList?: TagObject[]
  children?: FileTreeNode[];
  temporary_link?: string;
}
