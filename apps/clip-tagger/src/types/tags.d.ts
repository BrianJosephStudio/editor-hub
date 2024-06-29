export type IterableTagListId = 'agent' | 'map' 

export interface TagObject {
  tag: string;
  displayName: string;
  description: string;
  unique?: boolean;
  keybind: string;
  id: string;
}

export interface TagGroup {
  tags: TagObject[];
  keybindGroup: string;
  unique: boolean;
  iterable: boolean;
  id: string;
}

export interface ClipTags {
  tags: TagObject[];
}
