import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { AVItem } from "./AVItem";
import { CompItem } from "./CompItem";
import { FolderItem } from "./FolderItem";
import { FootageItem } from "./FootageItem";
import {
  CompItemProps,
  FolderItemProps,
  FootageItemProps,
  ItemObjectProps,
  RangedInteger_0_16,
  TypeName,
} from "./types";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper();

export class Item {
  public readonly comment: string;
  public readonly id: number;
  public readonly label: RangedInteger_0_16;
  public readonly name: string;
  public readonly parentFolder: FolderItem;
  public readonly selected: boolean;
  public readonly typeName: "Folder" | "Footage" | "Composition";

  constructor({
    comment,
    id,
    label,
    name,
    parentFolder,
    selected,
    typeName,
  }: ItemObjectProps) {
    this.comment = comment;
    this.id = id;
    this.label = label;
    this.name = name;
    this.parentFolder = parentFolder;
    this.selected = selected;
    this.typeName = typeName;
    this;
  }

  public readonly remove = () => {};

  public readonly setParentFolder = (
    parentFolder: FolderItem
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        csInterface.evalScript(
          `_Item_setParentFolder(${this.id}, ${parentFolder.id})`,
          (response) => {
            const responseObject = parseResponseObject(response);
            if (!responseObject)
              return reject(
                "Something went wrong when attempting to parse response from ExtendScript"
              );

            if (!responseObject.success)
              return reject(
                "Something went wrong running _Item_setParentFolder()"
              );
          }
        );
        resolve();
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };

  /**STATIC METHODS */

  public static readonly getByIndex = async (
    index: number
  ): Promise<FootageItem | CompItem | FolderItem | null> => {
    return new Promise((resolve, reject) => {
      csInterface.evalScript(`app.project.item(${index})`, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response))
          reject(new Error(response));

        try {
          const createdItem = this.getItemFromResponseData(response);
          resolve(createdItem);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  public static readonly getItemFromResponseData = (
    responseData: string,
    expectedTypeName?: TypeName
  ): FootageItem | CompItem | FolderItem | null => {
    const typeName = this.validateTypeName(responseData);
    if (!typeName) throw new Error("Could not find typeName");
    if (expectedTypeName && expectedTypeName !== typeName) return null;

    let itemProps = JSON.parse(responseData);

    switch (typeName) {
      case "Footage":
        return new FootageItem(itemProps as FootageItemProps);
      case "Composition":
        return new CompItem(itemProps as CompItemProps);
      case "Folder":
        return new FolderItem(itemProps as FolderItemProps);
      default:
        throw new Error("Could not find typeName");
    }
  };

  public static readonly getByID = async (
    id: number
  ): Promise<FootageItem | CompItem | FolderItem | null> => {
    return new Promise((resolve, reject) => {
      csInterface.evalScript(`app.project.itemByID(${id})`, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response))
          reject(new Error(response));

        try {
          const createdItem = this.getItemFromResponseData(response);
          resolve(createdItem);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  private static readonly isProjectItem = (
    extendScriptResponse: string
  ): ItemObjectProps | null => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (
        !parsedResponse.comment ||
        !parsedResponse.id ||
        !parsedResponse.name ||
        !parsedResponse.parentFolder ||
        !parsedResponse.selected ||
        !parsedResponse.typeName
      )
        throw new Error("Object doesn´t match ItemObject schema");

      return parsedResponse as ItemObjectProps;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  private static readonly validateTypeName = (
    extendScriptResponse: string
  ): TypeName | null => {
    const isProjectItem = this.isProjectItem(extendScriptResponse);
    if (!isProjectItem) {
    }
    const isAVItem = AVItem.isAVItem(extendScriptResponse);
    if (isAVItem) {
      const isFootageItem = FootageItem.isFootageItem(extendScriptResponse);
      if (isFootageItem) return "Footage";
      const isCompItem = CompItem.isCompItem(extendScriptResponse);
      if (isCompItem) return "Composition";

      return null;
    }
    const isFolderItem = FolderItem.isFolderItem(extendScriptResponse);
    if (isFolderItem) return "Folder";
    return null;
  };
}
