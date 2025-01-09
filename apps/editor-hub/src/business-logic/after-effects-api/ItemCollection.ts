import { Collection } from "./Collection";
import { CompItem } from "./CompItem";
import { Item } from "./Item";
import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";

const csInterface = new CSInterfaceWrapper();

export class ItemCollection extends Collection {
  private readonly parentItemId: number;

  constructor(parentItemId: number, items: Item[]) {
    super(items);
    this.parentItemId = parentItemId;
  }

  public readonly addComp = (
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
              '${width}',
              '${height}',
              ${pixelAspect},
              ${duration},
              ${frameRate},
              )`,
          (response) => {

          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };
  public readonly addFolder = async () => {};
}
