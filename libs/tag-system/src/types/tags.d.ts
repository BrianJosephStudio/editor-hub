export type IterableTagListId = "agent" | "map";
type uuid = string

export interface TagObject {
  tag: string;
  displayName: string;
  description: string;
  unique?: boolean;
  timeless: boolean;
  protected: boolean;
  keybind: string;
  id: string;
}

export interface ExclusiveTags {
  tagObject: TagObject;
  time?: number;
}

export interface GenericTag {
  tagObject: TagObject;
  time?: number;
  top: number;
  left: number;
  instanceId: string;
}

export interface TagGroup {
  groupName: string
  tags: TagObject[];
  keybindGroup: string;
  exclusive: boolean;
  iterable: boolean;
  id: string;
}

export interface ClipTags {
  tags: TagObject[];
}

export type TimeCode = number;

export interface TimeEntry {
  time: TimeCode;
  instanceId: string;
}
export interface UnlabeledTagReference {
  [tagId: string]: TimeCode[];
}
export interface LabeledTagReference {
  [tagId: string]: TimeEntry[];
}

export interface TagSystem {
  [name: string]: TagGroup
}