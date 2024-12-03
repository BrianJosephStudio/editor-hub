import CSInterfaceMock from "./util/mocks/csInterface.mock";
import { NodeWrapper } from "./node.wrapper";

export class PremiereApi {
  private CSInterface: any | CSInterfaceMock;
  private node: NodeWrapper;
  private cs: any | CSInterfaceMock;
  constructor() {
    this.node = new NodeWrapper();
    if (this.node.isNodeEnv) {
      this.CSInterface = require(`${__dirname.replace(
        /\\/g,
        "/"
      )}/Client/CSInterface.js`);
    } else {
      this.CSInterface = CSInterfaceMock;
    }
    this.cs = new this.CSInterface();
  }
  importResource = async (path: string) => {
    return new Promise((resolve, _reject) => {
        this.cs.evalScript(
          `app.project.importFiles("${path}", true, app.project.rootItem, false)`,
          //@ts-ignore
          (response) => {
            console.log("Response from Premiere:", response);
            resolve(true)
          }
        );
    })
  };
}
