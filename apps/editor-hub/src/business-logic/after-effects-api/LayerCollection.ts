import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { AVItem } from "./AVItem";
import { AVLayer } from "./AVLayer";
import { Collection } from "./Collection";
import { Layer } from "./Layer";
import { AVLayerProps } from "./types";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper();

export class LayerCollection extends Collection {
  private readonly parentCompId: number;
  constructor(parentCompId: number, entries: Layer[]) {
    super(entries);
    this.parentCompId = parentCompId;
  }

  public readonly add = (item: AVItem, duration?: number): Promise<AVLayer> => {
    return new Promise((resolve, reject) => {
      try {
        csInterface.evalScript(
          `_LayerCollection_add(${this.parentCompId}, ${item.id}${
            !!duration ? ", " + duration : null
          })`,
          (response) => {
            const responseObject = parseResponseObject(response);
            if (!responseObject.success)
              throw "Something went wront executing _LayerCollection_add()";

            const avLayerProps = JSON.parse(
              responseObject.value
            ) as AVLayerProps;

            const avLayer = new AVLayer(avLayerProps);

            resolve(avLayer);
          }
        );
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };
}
