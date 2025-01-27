import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { AVItem } from "./AVItem";
import { Layer } from "./Layer";
import { LayerCollection } from "./LayerCollection";
import { Property } from "./Property";
import { PropertyGroup } from "./PropertyGroup";
import { CompItemProps } from "./types";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper()

export class CompItem extends AVItem {
  public readonly bgColor: [number, number, number];
  public readonly dropFrame: boolean;
  public readonly frameDuration: number;
  public readonly hideShyLayers: boolean;
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
    this.markerProperty = compItemProps.markerProperty;
    this.motionBlur = compItemProps.motionBlur;
    this.numLayers = compItemProps.numLayers;
    this.selectedLayers = compItemProps.selectedLayers;
    this.selectedProperties = compItemProps.selectedProperties;
  }

  public readonly duplicate = async () => {};
  public readonly layer = async () => {};
  public readonly layers = (): Promise<LayerCollection> => {
    return new Promise((resolve, reject) => {
      csInterface.evalScript(`_CompItem_layers(${this.id})`, (response) => {
        try{
          const responseObject = parseResponseObject(response)
  
          if(!responseObject.success) return reject('Something went wrong running _CompItem_layers()');
  
          const layerArray = JSON.parse(responseObject.value) as any[] 
  
          const layers = this.parseLayerArray(layerArray)
  
          const layerCollection = new LayerCollection(this.id, layers)
  
          resolve(layerCollection)
        }catch(e){
          console.error(e)
          reject(e)
        }
      })
    })
  };
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

  private readonly parseLayerArray = (
      layerArray: any[]
    ): Layer[] => {
      const isArray = Array.isArray(layerArray);
      if (!isArray) throw new Error("layerArray input is not an array");
        const LayerObjectArray = layerArray.map((responseData) => {
          const layer = Layer.getLayerFromResponseData(responseData);
          return layer;
        });
        
        return LayerObjectArray;
    };
}
