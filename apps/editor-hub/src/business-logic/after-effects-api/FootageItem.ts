import { AVItem } from "./AVItem";
import { File } from "./File";
import { FootageSource } from "./FootageSource";
import { FootageItemProps } from "./types";
import { Viewer } from "./Viewer";

export class FootageItem extends AVItem {
  public readonly file: File;
  public readonly mainSource: FootageSource;

  constructor(footageItemProps: FootageItemProps) {
    super(footageItemProps);
    this.file = footageItemProps.file;
    this.mainSource = footageItemProps.mainSource;
  }

  //@ts-ignore
  public readonly openInViewer = async (): Promise<Viewer> => {};
  public readonly replace = async (): Promise<void> => {};
  public readonly replaceWithPlaceholder = async (): Promise<void> => {};
  public readonly replaceWithSequence = async (): Promise<void> => {};
  public readonly replaceWithSolid = async (): Promise<void> => {};

  public static readonly isFootageItem = (extendScriptResponse: string): boolean => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse)
        if(
            !parsedResponse.file ||
            !parsedResponse.mainSource
        ) return false
        return true
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}
