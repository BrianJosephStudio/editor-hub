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

  constructor({
    bgColor,
    dropFrame,
    frameDuration,
    hideShyLayers,
    layers,
    markerProperty,
    motionBlur,
    numLayers,
    selectedLayers,
    selectedProperties,
  }: CompItemProps) {
    super();
    this.bgColor = bgColor;
    this.dropFrame = dropFrame;
    this.frameDuration = frameDuration;
    this.hideShyLayers = hideShyLayers;
    this.layers = layers;
    this.markerProperty = markerProperty;
    this.motionBlur = motionBlur;
    this.numLayers = numLayers;
    this.selectedLayers = selectedLayers;
    this.selectedProperties = selectedProperties;
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
