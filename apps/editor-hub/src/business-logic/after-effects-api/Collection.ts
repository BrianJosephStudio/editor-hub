import { Item } from "./Item";
import { Layer } from "./Layer";

export class Collection {
  public readonly entries: Item[] | Layer[] ;
  public readonly length: number;

  constructor(entries: Item[] | Layer[]) {
    this.entries = entries;
    this.length = entries.length;

    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string" && !isNaN(Number(prop))) {
          return target.entries[Number(prop)];
        }
        return (target as any)[prop];
      },
    });
  }
}
