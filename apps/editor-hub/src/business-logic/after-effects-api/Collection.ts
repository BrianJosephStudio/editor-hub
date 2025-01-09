import { Item } from "./Item";

export class Collection {
  private readonly items: Item[];
  public readonly length: number;

  constructor(items: Item[]) {
    this.items = items;
    this.length = items.length;

    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string" && !isNaN(Number(prop))) {
          return target.items[Number(prop)]; // Access array element
        }
        return (target as any)[prop];
      },
    });
  }
}
