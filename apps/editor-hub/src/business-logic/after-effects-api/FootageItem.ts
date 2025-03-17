import { AVItem } from "./AVItem";
import { FootageSource } from "./FootageSource";
import { FootageItemProps } from "./types";
import { Viewer } from "./Viewer";
import { FolderItem } from "./FolderItem";


export class FootageItem extends AVItem {
  public readonly file: string;
  public readonly mainSource: FootageSource;

  constructor(footageItemProps: FootageItemProps) {
    super(footageItemProps);
    this.file = footageItemProps.file;
    this.mainSource = footageItemProps.mainSource;
  }

  //@ts-ignore
  public readonly openInViewer = async (): Promise<Viewer> => { };
  public readonly replace = async (): Promise<void> => { };
  public readonly replaceWithPlaceholder = async (): Promise<void> => { };
  public readonly replaceWithSequence = async (): Promise<void> => { };
  public readonly replaceWithSolid = async (): Promise<void> => { };

  public static readonly isFootageItem = (extendScriptResponse: string): boolean => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse)
      if (
        !parsedResponse.file ||
        !parsedResponse.mainSource
      ) return false
      return true
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  public static readonly assertFootageItem = (item: any): item is FolderItem => {
    return (
      item &&
      item.comment !== null &&
      item.comment !== undefined &&
      typeof item.comment === 'string' &&
      item.id !== null &&
      item.id !== undefined &&
      typeof item.id === 'number' &&
      item.label !== null &&
      item.label !== undefined &&
      typeof item.label === 'number' &&
      item.name !== null &&
      item.name !== undefined &&
      typeof item.name === 'string' &&
      item.typeName !== null &&
      item.typeName !== undefined &&
      typeof item.typeName === 'string' &&
      item.typeName === 'Footage' &&
      item.mainSource !== null &&
      item.mainSource !== undefined
    )
  };
}
