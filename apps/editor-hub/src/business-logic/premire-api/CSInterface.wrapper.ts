import { CSInterface, HostEnvironment } from "@extendscript/csinterface/dist/v8";
import { NodeWrapper } from "../node.wrapper";
import axios from "axios";

/**
 * This wrapper's goal is to identify which environment the app is running in
 * to decide whether to execute CsInterface methods or to return mocked values.
 * This allows the app to run in a browser environment, outside of Adobe Programs
 * without throwing errors that would occur otherwise.
 */

export class CSInterfaceWrapper {
  public hostEnvironment: HostEnvironment
  protected node: NodeWrapper;
  protected csInterface: CSInterface;

  constructor() {
    this.node = new NodeWrapper();
    this.csInterface = new CSInterface();
    this.hostEnvironment = this.csInterface.hostEnvironment
  }

  public declareJSXFunctions = async (): Promise<void> => {
    if (!this.node.isNodeEnv) return;
    if(this.hostEnvironment.appId === 'PPRO'){
      await this.declarePremiereJSX()
    }
    if(this.hostEnvironment.appId === 'AEFT'){
      await this.declareAfterEffectsJSX()
    }
  };
  
  private readonly declarePremiereJSX = async () => {
    const { data: jsonParser } = await axios.get("extendScript/json2.js");
    const { data: jsxCsInterfaceXDeclarations } = await axios.get(
      "extendScript/index.js"
    );
    const { data: jsxEditorHubDeclarations } = await axios.get(
      "extendScript/ProjectItem.js"
    );
    await this.evalScript(jsonParser);
    await this.evalScript(jsxCsInterfaceXDeclarations);
    await this.evalScript(jsxEditorHubDeclarations);
  }
  
  private readonly declareAfterEffectsJSX = async () => {
    const { data: jsonParser } = await axios.get("extendScript/json2.js");
    const { data: jsxCsInterfaceXDeclarations } = await axios.get(
      "extendScript/after-effects-api/index.jsx"
    );
    await this.evalScript(jsonParser);
    await this.evalScript(jsxCsInterfaceXDeclarations);

  }

  public evalScript = async (
    script: string,
    callback: (response: string) => void = (response) => response
  ) => {
    return new Promise((resolve, reject) => {
      if (!this.node.isNodeEnv) return resolve("Mocked value");
      this.csInterface.evalScript(script, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response))
          return reject(response);

        resolve(callback(response));
      });
    });
  };

  static isEvalScriptError = (response: string): boolean => {
    if (response === "EvalScript error.") {
      return true;
    }
    return false;
  };
}
