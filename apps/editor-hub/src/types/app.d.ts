import { Metadata } from "@editor-hub/dropbox-types"
import { TagObject } from "@editor-hub/tag-system"

export type FileTreeName = 'inGameFootage' | 'music' | 'sfx'

export interface FileTreeNode {
  fileTreeName?: FileTreeName
  name: string;
  tag: "file" | "folder";
  path: string;
  filtered: boolean
  metadata?: Metadata;
  tagList?: TagObject[]
  children?: FileTreeNode[];
  temporary_link?: string;
}

export type AppEnvironment = 'production' | 'qa' | 'dev' | 'localhost' | 'staging' | null