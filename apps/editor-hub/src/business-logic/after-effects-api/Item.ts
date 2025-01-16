import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { FolderItem } from "./FolderItem";
import { Project } from "./Project";
import {
  ItemObjectProps,
  RangedInteger_0_16,
  TypeName
} from "./types";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper();

export class Item {
  public readonly comment: string;
  public readonly id: number;
  public readonly label: RangedInteger_0_16;
  public readonly name: string;
  public readonly typeName: "Folder" | "Footage" | "Composition";

  constructor({
    comment,
    id,
    label,
    name,
    typeName,
  }: ItemObjectProps) {
    this.comment = comment;
    this.id = id;
    this.label = label;
    this.name = name;
    this.typeName = typeName;
  }

  public readonly remove = () => {};

  public readonly setParentFolder = (
    parentFolder: any
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
  public static readonly isProjectItem = (
    extendScriptResponse: string
  ): ItemObjectProps | null => {
    try {
      console.log("isProjectItem", extendScriptResponse)
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (
        parsedResponse.comment === undefined ||
        parsedResponse.id === undefined ||
        parsedResponse.name === undefined ||
        parsedResponse.label === undefined ||
        parsedResponse.parentFolder === undefined ||
        parsedResponse.typeName === undefined
      )
        throw "Object doesn´t match ItemObject schema";

      // let parentFolder: FolderItem | null = null
      // if(parsedResponse.parentFolder !== null){

      //   const parentFolderResponseData = JSON.stringify(parsedResponse.parentFolder)
      //   parentFolder =  Project.getItemFromResponseData(parentFolderResponseData, 'Folder') as FolderItem | null
      // }

      const itemObjectProps: ItemObjectProps = {
        comment: parsedResponse.comment as string,
        id: parsedResponse.id as number,
        name: parsedResponse.name as string,
        label: parsedResponse.label as RangedInteger_0_16,
        typeName: parsedResponse.typeName as TypeName
      }

      return itemObjectProps;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
