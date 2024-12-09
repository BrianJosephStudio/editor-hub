import { CSInterface } from "@extendscript/csinterface/dist/v8";
import { NodeWrapper } from "../node.wrapper";
import axios from "axios";
import { resolve } from "bun";

/**
 * This wrapper's goal is to identify which environment the app is running in
 * to decide whether to execute CsInterface methods or to return mocked values.
 * This allows the app to run in a browser environment, outside of Adobe Programs
 * without throwing errors that would occur otherwise.
 */

export class CSInterfaceWrapper {
  protected node: NodeWrapper;
  protected csInterface: CSInterface;

  constructor() {
    this.node = new NodeWrapper();
    this.csInterface = new CSInterface();
  }

  public declareJSXFunctions = async (): Promise<void> => {
    if (!this.node.isNodeEnv) return;
    
    const { data: jsonParser } = await axios.get("extendScript/json2.js");
    const { data: jsxDeclarations } = await axios.get("extendScript/index.js");
    await this.evalScript(jsonParser);
    await this.evalScript(jsxDeclarations);
  };

  public evalScript = async (
    script: string,
    callback: (response: string) => void = (response) => response
  ) => {
    return new Promise((resolve) => {
      if (!this.node.isNodeEnv) return resolve("Mocked value");

      this.csInterface.evalScript(script, (response) => {
        return resolve(callback(response));
      });
    });
  };

  static isEvalScriptError = (response: string): boolean => {
    if(response === 'EvalScript error.'){
      return true
    }
    return false
  }
}
