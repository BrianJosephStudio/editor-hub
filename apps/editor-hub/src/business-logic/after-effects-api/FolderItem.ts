import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { CompItem } from "./CompItem";
import { FootageItem } from "./FootageItem";
import { Item } from "./Item";
import { ItemCollection } from "./ItemCollection";
import { FolderItemProps } from "./types";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper();

export class FolderItem extends Item {
  public readonly numItems: number;

  constructor(folderItemProps: FolderItemProps) {
    super(folderItemProps);
    this.numItems = folderItemProps.numItems;
  }

  public readonly items = async (): Promise<ItemCollection> => {
    return new Promise((resolve, reject) => {
      csInterface.evalScript(`_folderItem_items(${this.id})`, (response) => {
        const responseObject = parseResponseObject(response);
        if (!responseObject)
          return reject(
            "Something went wrong when attempting to parse response from"
          );

        if (!responseObject.success)
          return reject("Something went wrong running _folderItem_items()");

        try {
          const itemArray = this.parseItemArray(responseObject.value as any[]);
          const itemCollection = new ItemCollection(this.id, itemArray);
          resolve(itemCollection);
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    });
  };
  //@ts-ignore
  public readonly item = async (): Promise<Item> => {};

  public static readonly isFolderItem = (
    extendScriptResponse: string
  ): boolean => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (!parsedResponse.items || !parsedResponse.numItems) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  private readonly parseItemArray = (
    itemArray: any[]
  ): (FootageItem | CompItem | FolderItem)[] => {
    const isArray = Array.isArray(itemArray);
    if (!isArray) throw new Error("itemArray input is not an array");

    const itemObjectArray = itemArray.map((responseData) =>
      Item.getItemFromResponseData(responseData)
    );
    return itemObjectArray;
  };
}
