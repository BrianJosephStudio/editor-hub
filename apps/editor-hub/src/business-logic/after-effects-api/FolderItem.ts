import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { CompItem } from "./CompItem";
import { FootageItem } from "./FootageItem";
import { Item } from "./Item";
import { ItemCollection } from "./ItemCollection";
import { Project } from "./Project";
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
        console.log(response)
        const responseObject = parseResponseObject(response);
        if (!responseObject.success)
          throw "Something went wrong running _FolderItem_items()";

        try {
          const itemsArray = JSON.parse(responseObject.value) as any[];
          const itemArray = this.parseItemArray(itemsArray);
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
      if (
        parsedResponse.items === undefined ||
        parsedResponse.numItems === undefined ||
        parsedResponse.typeName !== "Folder"
      )
        return false;
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

    const itemObjectArray = itemArray.map((responseData) => {
      const item = Project.getItemFromResponseData(responseData);
      if (!item) throw new Error("getItemFromResponseData returned null");
      return item;
    });

    return itemObjectArray;
  };
}
