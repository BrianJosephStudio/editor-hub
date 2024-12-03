export class NodeWrapper {
  os: any;
  fsPromises: any;
  path: any;

  constructor() {
    if (this.isNodeEnvironment()) {
      this.os = require("os");
      this.fsPromises = require("fs/promises");
      this.path = require("path");
    } else {
      const { mockOs, mockFsPromises, mockPath } = require("./mocks/node.mock");
      this.os = mockOs;
      this.fsPromises = mockFsPromises;
      this.path = mockPath;
    }
  }

  private isNodeEnvironment(): boolean {
    return (
      typeof process !== "undefined" && process.versions?.node !== undefined
    );
  }
}
