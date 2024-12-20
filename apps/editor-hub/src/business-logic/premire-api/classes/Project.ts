import { CSInterfaceWrapper } from "../CSInterface.wrapper";
import { ProjectItem } from "./ProjectItem";

export class Project extends CSInterfaceWrapper {
  public rootItem: ProjectItem;

  static instance: Project;
  static readonly projectItems: ProjectItem[] = []

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

  static getProjectItem = (nodeId: string): ProjectItem | undefined => {
    return Project.projectItems.find((projectItem) => {
      return projectItem.nodeId === nodeId
    })
  }

  static addProjectItem = (projectItem: ProjectItem) => {
    const foundItem = Project.getProjectItem(projectItem.nodeId)
    if (foundItem) throw new Error("Project item already exists");
    Project.projectItems.push(projectItem)

  }

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
