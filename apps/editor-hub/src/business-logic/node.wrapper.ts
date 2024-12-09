import { mockOs, mockFs, mockFsPromises, mockPath } from "./util/mocks/node.mock";

export class NodeWrapper {
  isNodeEnv: boolean
  public os: any;
  public fs: any;
  public fsPromises: any;
  public path: any;

  constructor() {
    this.isNodeEnv = this.isNodeEnvironment()
    if (this.isNodeEnv) {
      this.os = require("os");
      this.fs = require("fs");
      this.fsPromises = require("fs/promises");
      this.path = require("path");
    } else {
      this.os = mockOs;
      this.fs = mockFs;
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
