import { ItemCollection } from "../ItemCollection";
import { Layer } from "../Layer";

export type PropertyType = "PROPERTY" | "INDEXED_GROUP" | "NAMED_GROUP";

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

export type BlendingMode =
  | "ADD"
  | "ALPHA_ADD"
  | "CLASSIC_COLOR_BURN"
  | "CLASSIC_COLOR_DODGE"
  | "CLASSIC_DIFFERENCE"
  | "COLOR"
  | "COLOR_BURN"
  | "COLOR_DODGE"
  | "DANCING_DISSOLVE"
  | "DARKEN"
  | "DARKER_COLOR"
  | "DIFFERENCE"
  | "DISSOLVE"
  | "DIVIDE"
  | "EXCLUSION"
  | "HARD_LIGHT"
  | "HARD_MIX"
  | "HUE"
  | "LIGHTEN"
  | "LIGHTER_COLOR"
  | "LINEAR_BURN"
  | "LINEAR_DODGE"
  | "LINEAR_LIGHT"
  | "LUMINESCENT_PREMUL"
  | "LUMINOSITY"
  | "MULTIPLY"
  | "NORMAL"
  | "OVERLAY"
  | "PIN_LIGHT"
  | "SATURATION"
  | "SCREEN"
  | "SUBTRACT"
  | "SILHOUETE_ALPHA" // Note the misspelling here
  | "SILHOUETTE_LUMA"
  | "SOFT_LIGHT"
  | "STENCIL_ALPHA"
  | "STENCIL_LUMA"
  | "SUBTRACT"
  | "VIVID_LIGHT";

export type FrameBlendingType = "FRAME_MIX" | "NO_FRAME_BLEND" | "PIXEL_MOTION";

export type LayerQuality = "BEST" | "DRAFT" | "WIREFRAME";
export type LayerSamplingQuality = "BICUBIC" | "BILINEAR";

export type TrackMatteType =
  | "ALPHA"
  | "ALPHA_INVERTED"
  | "LUMA"
  | "LUMA_INVERTED"
  | "NO_TRACK_MATTE";

export type TypeName = "Folder" | "Footage" | "Composition";

export interface ItemObjectProps {
  comment: string;
  id: number;
  label: RangedInteger_0_16;
  name: string;
  typeName: TypeName;
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
  markerProperty: PropertyGroup | null;
  motionBlur: boolean;
  numLayers: number;
  selectedLayers: Layer[];
  selectedProperties: (Property | PropertyGroup)[];
}

export interface FolderItemProps extends ItemObjectProps {
  numItems: number;
}

export interface LayerProps extends PropertyGroupProps {
  comment: string;
  containingComp;
  hasVideo: boolean;
  id: number;
  index: number;
  inPoint: number;
  isNameSet: boolean;
  label: RangedInteger_0_16;
  locked: boolean;
  marker: PropertyGroup | null;
  nullLayer: boolean;
  outPoint: number;
  parent: Layer | null;
  selectedProperties: PropertyBase[];
  shy: boolean;
  solo: boolean;
  startTime: number;
  stretch: number;
  time: number;
}

export interface PropertyGroupProps extends PropertyBaseProps {
  numProperties: number;
}

export interface PropertyBaseProps {
  active: boolean;
  canSetEnabled: boolean;
  enabled: boolean;
  isEffect: boolean;
  isMask: boolean;
  isModified: boolean;
  matchName: string;
  name: string;
  parentProperty: PropertyGroup | null;
  propertyDepth: number;
  propertyIndex: number;
  propertyType: PropertyType;
  selected: boolean;
}

export interface AVLayerProps extends Layer {
  adjusmentLayer: boolean;
  audioActive: boolean;
  audioEnabled: boolean;
  blendingMode: BlendingMode;
  caSetCollapseTransformation: boolean;
  canSetTimeRemapEnabled: boolean;
  collapseTransformation: boolean;
  effectsActive: boolean;
  environmentLayer: boolean;
  frameBlending: boolean;
  frameBlendingType: FrameBlendingType;
  guideLayer: boolean;
  hasAudio: boolean;
  hasTrackMatte: boolean;
  height: number;
  isNameFromSource: boolean;
  isTrackMatte: boolean;
  motionBlue: boolean;
  preserveTransparency: boolean;
  quality: LayerQuality;
  samplingquality: LayerSamplingQuality;
  source: AVItem;
  threeDLayer: boolean;
  threeDPerChar: boolean;
  timeRemapEnabled: boolean;
  trackMatteLayer: AVLayer;
  trackMatteType: TrackMatteType;
  width: number;
}
