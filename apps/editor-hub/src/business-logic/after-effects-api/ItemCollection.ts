import { Collection } from "./Collection";
import { CompItem } from "./CompItem";
import { Item } from "./Item";
import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { parseResponseObject } from "./util";
import { FolderItem } from "./FolderItem";
import { Project } from "./Project";

const csInterface = new CSInterfaceWrapper();

export class ItemCollection extends Collection {
  private readonly parentItemId: number;

  constructor(parentItemId: number, items: Item[]) {
    super(items);
    this.parentItemId = parentItemId;
  }

  public readonly addComp = (
    name: string,
    width: string,
    height: string,
    pixelAspect: number,
    duration: number,
    frameRate: number
  ): Promise<CompItem> => {
    return new Promise((resolve, reject) => {
      try {
        csInterface.evalScript(
          `_ItemCollection_addComp(
              '${this.parentItemId}',
              '${name}',
              '${width}',
              '${height}',
              ${pixelAspect},
              ${duration},
              ${frameRate},
              )`,
          (response) => {
            const responseObject = parseResponseObject(response);
            if (!responseObject)
              return reject(
                "Something went wrong when attempting to parse response from ExtendScript"
              );

            if (!responseObject.success)
              return reject(
                "Something went wrong running _ItemCollection_addComp()"
              );

            const createdItem = Project.getItemFromResponseData(
              responseObject.value,
              "Composition"
            );
            if (!createdItem)
              throw new Error(
                'createdComp is expected to have typeName "Composition" but failed to match the expected schema'
              );

            const createdComp = createdItem as CompItem;

            resolve(createdComp);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };
  public readonly addFolder = (name: string): Promise<FolderItem> => {
    return new Promise((resolve, reject) => {
      try {
        csInterface.evalScript(
          `_ItemCollection_addFolder(
        ${this.parentItemId},
        '${name}'
        )`,
          (response) => {
            const responseObject = parseResponseObject(response);

            if (!responseObject.success)
              return reject(
                "Something went wrong running _ItemCollection_addFolder()"
              );

            const createdItem = Project.getItemFromResponseData(
              responseObject.value,
              "Folder"
            );
            if (!createdItem)
              throw new Error(
                'createdComp is expected to have typeName "Folder" but failed to match the expected schema'
              );

            const createdFolder = createdItem as FolderItem;

            resolve(createdFolder);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };
}
