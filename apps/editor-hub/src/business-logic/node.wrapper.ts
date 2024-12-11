export class NodeWrapper {
  isNodeEnv: boolean;
  public os: typeof import("os") | undefined;
  public fs: typeof import("fs") | undefined;
  public fsPromises: typeof import("fs/promises") | undefined;
  public path: typeof import("path") | undefined;

  constructor() {
    this.isNodeEnv = this.isNodeEnvironment();

    if (!this.isNodeEnv) return;
    
    this.os = require("os");
    this.fs = require("fs");
    this.fsPromises = require("fs/promises");
    this.path = require("path");
  }

  private isNodeEnvironment(): boolean {
    return (
      typeof process !== "undefined" && process.versions?.node !== undefined
    );
  }
}
