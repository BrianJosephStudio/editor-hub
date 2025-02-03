import { AVItem } from "./AVItem";
import { Layer } from "./Layer";
import {
  AVLayerProps,
  BlendingMode,
  FrameBlendingType,
  LayerQuality,
  LayerSamplingQuality,
  TrackMatteType,
} from "./types";

export class AVLayer extends Layer {
  public readonly adjusmentLayer: boolean;
  public readonly audioActive: boolean;
  public readonly audioEnabled: boolean;
  public readonly blendingMode: BlendingMode;
  public readonly caSetCollapseTransformation: boolean;
  public readonly canSetTimeRemapEnabled: boolean;
  public readonly collapseTransformation: boolean;
  public readonly effectsActive: boolean;
  public readonly environmentLayer: boolean;
  public readonly frameBlending: boolean;
  public readonly frameBlendingType: FrameBlendingType;
  public readonly guideLayer: boolean;
  public readonly hasAudio: boolean;
  public readonly hasTrackMatte: boolean;
  public readonly height: number;
  public readonly isNameFromSource: boolean;
  public readonly isTrackMatte: boolean;
  public readonly motionBlue: boolean;
  public readonly preserveTransparency: boolean;
  public readonly quality: LayerQuality;
  public readonly samplingquality: LayerSamplingQuality;
  public readonly source: AVItem;
  public readonly threeDLayer: boolean;
  public readonly threeDPerChar: boolean;
  public readonly timeRemapEnabled: boolean;
  public readonly trackMatteLayer: AVLayer;
  public readonly trackMatteType: TrackMatteType;
  public readonly width: number;

  constructor(avLayerProps: AVLayerProps) {
    super(avLayerProps);
    this.adjusmentLayer = avLayerProps.adjusmentLayer;
    this.audioActive = avLayerProps.audioActive;
    this.audioEnabled = avLayerProps.audioEnabled;
    this.blendingMode = avLayerProps.blendingMode;
    this.caSetCollapseTransformation = avLayerProps.caSetCollapseTransformation;
    this.canSetTimeRemapEnabled = avLayerProps.canSetTimeRemapEnabled;
    this.collapseTransformation = avLayerProps.collapseTransformation;
    this.effectsActive = avLayerProps.effectsActive;
    this.environmentLayer = avLayerProps.environmentLayer;
    this.frameBlending = avLayerProps.frameBlending;
    this.frameBlendingType = avLayerProps.frameBlendingType;
    this.guideLayer = avLayerProps.guideLayer;
    this.hasAudio = avLayerProps.hasAudio;
    this.hasTrackMatte = avLayerProps.hasTrackMatte;
    this.height = avLayerProps.height;
    this.isNameFromSource = avLayerProps.isNameFromSource;
    this.isTrackMatte = avLayerProps.isTrackMatte;
    this.motionBlue = avLayerProps.motionBlue;
    this.preserveTransparency = avLayerProps.preserveTransparency;
    this.quality = avLayerProps.quality;
    this.samplingquality = avLayerProps.samplingquality;
    this.source = avLayerProps.source;
    this.threeDLayer = avLayerProps.threeDLayer;
    this.threeDPerChar = avLayerProps.threeDPerChar;
    this.timeRemapEnabled = avLayerProps.timeRemapEnabled;
    this.trackMatteLayer = avLayerProps.trackMatteLayer;
    this.trackMatteType = avLayerProps.trackMatteType;
    this.width = avLayerProps.width;
  }
}
