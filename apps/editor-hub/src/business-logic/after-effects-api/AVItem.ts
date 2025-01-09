import { CompItem } from "./CompItem";
import { Item } from "./Item";
import { AVItemProps } from "./types";

export class AVItem extends Item {
  public readonly duration: number;
  public readonly frameDuration: number;
  public readonly frameRate: number;
  public readonly height: number;
  public readonly width: number;
  public readonly footageMissing: boolean;
  public readonly hasAudio: boolean;
  public readonly hasVideo: boolean;
  public readonly isMediaReplacementCompatible: boolean;
  public readonly time: number;
  public readonly usedIn: CompItem[];
  public readonly useProxy: boolean;

  constructor(avItemProps: AVItemProps) {
    super(avItemProps);
    this.duration = avItemProps.duration;
    this.frameDuration = avItemProps.frameDuration;
    this.frameRate = avItemProps.frameRate;
    this.height = avItemProps.height;
    this.width = avItemProps.width;
    this.footageMissing = avItemProps.footageMissing;
    this.hasAudio = avItemProps.hasAudio;
    this.hasVideo = avItemProps.hasVideo;
    this.isMediaReplacementCompatible =
      avItemProps.isMediaReplacementCompatible;
    this.time = avItemProps.time;
    this.usedIn = avItemProps.usedIn;
    this.useProxy = avItemProps.useProxy;
  }

  public static readonly isAVItem = (extendScriptResponse: string) => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (
        !parsedResponse.duration ||
        !parsedResponse.frameDuration ||
        !parsedResponse.frameRate ||
        !parsedResponse.height ||
        !parsedResponse.width ||
        !parsedResponse.footageMissing ||
        !parsedResponse.hasAudio ||
        !parsedResponse.hasVideo ||
        !parsedResponse.isMediaReplacementCompatible ||
        !parsedResponse.time ||
        !parsedResponse.usedIn ||
        !parsedResponse.useProxy
      )
        return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}
