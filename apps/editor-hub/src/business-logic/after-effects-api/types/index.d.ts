import { ItemCollection } from "../ItemCollection";

export type RangedInteger_0_16 =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16;

  export type TypeName = "Folder" | "Footage" | "Composition";
  
  export interface ItemObjectProps {
  comment: string;
  id: number;
  label: RangedInteger_0_16;
  name: string;
  parentFolder: FolderItem;
  selected: boolean;
  typeName: TypeName
}

export interface AVItemProps extends ItemObjectProps {
  duration: number;
  frameDuration: number;
  frameRate: number;
  height: number;
  width: number;
  footageMissing: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  isMediaReplacementCompatible: boolean;
  time: number;
  usedIn: CompItem[];
  useProxy: boolean;
}

export interface FootageItemProps extends AVItemProps {
  file: File;
  mainSource: FootageSource;
}

export interface CompItemProps extends AVItemProps {
  bgColor: [number, number, number];
  dropFrame: boolean;
  frameDuration: number;
  hideShyLayers: boolean;
  layers: LayerCollection;
  markerProperty: PropertyGroup | null;
  motionBlur: boolean;
  numLayers: number;
  selectedLayers: Layer[];
  selectedProperties: (Property | PropertyGroup)[];
}

export interface FolderItemProps extends ItemObjectProps {
  numItems: number
}