import { CSInterfaceWrapper } from "../CSInterface.wrapper";
import { ProjectItem } from "./ProjectItem";

export class Project extends CSInterfaceWrapper {
  static instance: Project;
  public rootItem: ProjectItem;

  private constructor(rootItem: ProjectItem) {
    super();
    this.rootItem = rootItem
  }

  static getInstance = async (): Promise<Project> => {
    if (Project.instance) return Project.instance;
    const csInterface = new CSInterfaceWrapper()
    await csInterface.declareJSXFunctions()

    const rootItem = await ProjectItem.getRootItem();
    
    const project = new Project(rootItem);

    return project
  };

  importFile = async (
    filePath: string,
    suppressUI: boolean,
    targetBin: ProjectItem,
    importAsNumberedStills: boolean
  ) => {
    return new Promise((resolve) => {
      this.csInterface.evalScript(
        `importFile("${filePath}", ${suppressUI}, "${targetBin.nodeId}", ${importAsNumberedStills})`,
        //@ts-ignore
        (response) => {
          resolve(response);
        }
      );
    });
  };
}
