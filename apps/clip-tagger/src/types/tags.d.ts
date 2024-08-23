export type IterableTagListId = 'agent' | 'map' 

export interface TagObject {
  tag: string;
  displayName: string;
  description: string;
  unique?: boolean;
  exclusive?: boolean;
  keybind: string;
  id: string;
}

export interface TagGroup {
  tags: TagObject[];
  keybindGroup: string;
  exclusive: boolean
  iterable: boolean;
  id: string;
}

export interface ClipTags {
  tags: TagObject[];
}

type TimeCode = number

export interface TagReference {
  [tagId: string]: Timecode[]
}