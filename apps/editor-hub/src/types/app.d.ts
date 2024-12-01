export interface FileTreeNode {
    name: string;
    tag: "file" | "folder";
    path: string;
    metadata?: Metadata;
    children?: FileTreeNode[];
  }