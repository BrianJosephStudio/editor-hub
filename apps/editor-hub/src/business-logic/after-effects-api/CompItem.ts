import { AVItem } from "./AVItem";
import { Layer } from "./Layer";
import { LayerCollection } from "./LayerCollection";
import { Property } from "./Property";
import { PropertyGroup } from "./PropertyGroup";
import { CompItemProps } from "./types";



export class CompItem extends AVItem {
  public readonly bgColor: [number, number, number];
  public readonly dropFrame: boolean;
  public readonly frameDuration: number;
  public readonly hideShyLayers: boolean;
  public readonly layers: LayerCollection;
  public readonly markerProperty: PropertyGroup | null;
  public readonly motionBlur: boolean;
  public readonly numLayers: number;
  public readonly selectedLayers: Layer[];
  public readonly selectedProperties: (Property | PropertyGroup)[];

  constructor(compItemProps: CompItemProps) {
    super(compItemProps);
    this.bgColor = compItemProps.bgColor;
    this.dropFrame = compItemProps.dropFrame;
    this.frameDuration = compItemProps.frameDuration;
    this.hideShyLayers = compItemProps.hideShyLayers;
    this.layers = compItemProps.layers;
    this.markerProperty = compItemProps.markerProperty;
    this.motionBlur = compItemProps.motionBlur;
    this.numLayers = compItemProps.numLayers;
    this.selectedLayers = compItemProps.selectedLayers;
    this.selectedProperties = compItemProps.selectedProperties;
  }

  public readonly duplicate = async () => {};
  public readonly layer = async () => {};
  public readonly openInViewer = async () => {};

  public static readonly getInstance = async () => {};
  public static readonly isCompItem = (
    extendScriptResponse: string
  ): boolean => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (
        !parsedResponse.bgColor ||
        !parsedResponse.dropFrame ||
        !parsedResponse.hideShyLayers ||
        !parsedResponse.layers ||
        !parsedResponse.markerProperty ||
        !parsedResponse.motionBlur ||
        !parsedResponse.numLayers ||
        !parsedResponse.selectedLayers ||
        !parsedResponse.selectedProperties
      )
        return false;

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}
