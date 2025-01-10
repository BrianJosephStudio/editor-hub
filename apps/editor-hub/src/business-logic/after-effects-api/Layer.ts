import { PropertyBase } from "./PropertyBase";
import { PropertyGroup } from "./PropertyGroup";
import { LayerProps, RangedInteger_0_16 } from "./types";

export class Layer extends PropertyGroup {
  public readonly comment: string;
  public readonly containingComp;
  public readonly hasVideo: boolean;
  public readonly id: number;
  public readonly index: number;
  public readonly inPoint: number;
  public readonly isNameSet: boolean;
  public readonly label: RangedInteger_0_16;
  public readonly locked: boolean;
  public readonly marker: PropertyGroup | null;
  public readonly nullLayer: boolean;
  public readonly outPoint: number;
  public readonly parent: Layer | null;
  public readonly selectedProperties: PropertyBase[];
  public readonly shy: boolean;
  public readonly solo: boolean;
  public readonly startTime: number;
  public readonly stretch: number;
  public readonly time: number;

  constructor(layerProps: LayerProps) {
    super(layerProps);
    this.comment = layerProps.comment;
    this.containingComp = layerProps.containingComp;
    this.hasVideo = layerProps.hasVideo;
    this.id = layerProps.id;
    this.index = layerProps.index;
    this.inPoint = layerProps.inPoint;
    this.isNameSet = layerProps.isNameSet;
    this.label = layerProps.label;
    this.locked = layerProps.locked;
    this.marker = layerProps.marker;
    this.nullLayer = layerProps.nullLayer;
    this.outPoint = layerProps.outPoint;
    this.parent = layerProps.parent;
    this.selectedProperties = layerProps.selectedProperties;
    this.shy = layerProps.shy;
    this.solo = layerProps.solo;
    this.startTime = layerProps.startTime;
    this.stretch = layerProps.stretch;
    this.time = layerProps.time;
  }

  public static readonly getLayerFromResponseData = (
    responseData: string
  ): Layer => {
    const isLayerObject = this.isLayerObject(responseData)
    if(!isLayerObject) throw "responseData is doesn't match Layer schema";

    const layerProps = JSON.parse(responseData) as LayerProps
    const layerObject = new Layer(layerProps)

    return layerObject
  };

  private static readonly isLayerObject = (extendScriptResponse: string): boolean => {
      try{
          const parsedResponse = JSON.parse(extendScriptResponse)

          if(
            parsedResponse.comment === undefined ||
            parsedResponse.containingComp === undefined ||
            parsedResponse.hasVideo === undefined ||
            parsedResponse.id === undefined ||
            parsedResponse.index === undefined ||
            parsedResponse.inPoint === undefined ||
            parsedResponse.isNameSet === undefined ||
            parsedResponse.label === undefined ||
            parsedResponse.locked === undefined ||
            parsedResponse.marker === undefined ||
            parsedResponse.nullLayer === undefined ||
            parsedResponse.outPoint === undefined ||
            parsedResponse.parent === undefined ||
            parsedResponse.selectedProperties === undefined ||
            parsedResponse.shy === undefined ||
            parsedResponse.solo === undefined ||
            parsedResponse.startTime === undefined ||
            parsedResponse.stretch === undefined ||
            parsedResponse.time === undefined 
          ) return false

          return true
      }catch(e){
        console.error(e)
        return false
      }
  }
}
