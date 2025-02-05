import { ProjectItem } from "../premire-api/classes/ProjectItem";
import { Project } from "../premire-api/classes/Project";

export class PremiereResource {
  private setPoints: boolean = false; //TODO: wip
  private inPoint: number = 2; //TODO: wip
  private outPoint: number = 10; //TODO: wip
  private projectItem?: ProjectItem;

  constructor() {}

  public static readonly getProjectPath = async (): Promise<string> => {
    const project = await Project.getInstance()

    const path = await project.getProjectPath()

    return path
  }
  public readonly import = async (uri: string, binPathArray: string[]) => {
    const project = await Project.getInstance();

    const createdBin = await this.createBinRecursive(binPathArray);
    if (!createdBin) {
      return console.error(createdBin);
    }

    await project.importFile(uri, true, createdBin, false);
    await this.getProjectItem(uri);
    await this.setInOutPoints();
  };

  private getProjectItem = async (uri: string): Promise<void> => {
    try {
      const importedProjectItem = await ProjectItem.getProjectItemBySourcePath(
        uri
      );
      this.projectItem = importedProjectItem;
    } catch (e) {
      console.error(e);
    }
  };

  private setInOutPoints = async (): Promise<void> => {
    if (!this.setPoints) return;
    if (!this.projectItem || !(this.projectItem instanceof ProjectItem)) {
      return console.error("projectItem is not initialized");
    }
    await this.projectItem.setInPoint(this.inPoint, 4);
    await this.projectItem.setOutPoint(this.outPoint, 4);
  };

  private createBinRecursive = async (
    binPathArray: string[]
  ): Promise<ProjectItem> => {
    const initialBin = await ProjectItem.getRootItem();

    const sequentialPiping = binPathArray.map((binName) => {
      return async (previousBin: ProjectItem): Promise<ProjectItem> => {
        const newBin = await previousBin.createBin(binName, true);
        return newBin;
      };
    });

    const finalBin = await sequentialPiping.reduce(
      (promiseChain, currentFunction) => promiseChain.then(currentFunction),
      Promise.resolve(initialBin) // Start with the initial bin
    );

    return finalBin;
  };
}
