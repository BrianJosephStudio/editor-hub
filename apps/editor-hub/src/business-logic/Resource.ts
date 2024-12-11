import { NodeWrapper } from "./node.wrapper";
import { FileTreeNode } from "../types/app";
import { ApiClient } from "../api/ApiClient";
import { ProjectItem } from "./premire-api/classes/ProjectItem";
import { Project } from "./premire-api/classes/Project";

const { isNodeEnv, fsPromises } = new NodeWrapper();

export class Resource {
  public readonly fileTreeNode: FileTreeNode;
  public readonly resourcePath: string;
  public readonly uri: string;
  public readonly folderPath: string;
  private setPoints: boolean = false //TODO: wip
  private inPoint: number = 2 //TODO: wip
  private outPoint: number = 10 //TODO: wip
  public binPathArray: string[]
  private projectItem?: ProjectItem

  constructor(fileTreeNode: FileTreeNode, resourcePath: string) {
    this.fileTreeNode = fileTreeNode;
    this.resourcePath = resourcePath;
    this.uri = `${this.resourcePath}${this.fileTreeNode.path}`;
    this.folderPath = this.getDirName(this.uri)
    this.binPathArray = this.getBinPath()
  }

  download = async () => {
    const apiClient = new ApiClient();
    const data = await apiClient.download(
      this.fileTreeNode.metadata.path_lower
    );

    if (!isNodeEnv) return console.log("File Download was triggered for ", this.fileTreeNode.name);

    const buffer = Buffer.from(data);
    const uint8Array = new Uint8Array(buffer);

    await fsPromises!.mkdir(this.folderPath, { recursive: true });
    try {
      await fsPromises!.access(this.uri, fsPromises!.constants.R_OK);
    } catch {
      await fsPromises!.writeFile(this.uri, uint8Array);
    }
  };

  import = async () => {
    if(!isNodeEnv) return console.log("Import function has been triggered for ", this.fileTreeNode.name)
    
    const project = await Project.getInstance()

    const createdBin = await this.createBinRecursive(this.binPathArray)
    if (!createdBin) {
      return console.error(createdBin)
    }

    await project.importFile(this.uri, true, createdBin, false)
    await this.getProjectItem()
    await this.setInOutPoints()
  };

  private getProjectItem = async (): Promise<void> => {
    try {
      const importedProjectItem = await ProjectItem.getProjectItemBySourcePath(this.uri)
      this.projectItem = importedProjectItem
    } catch (e) {
      console.error(e)
    }
  }

  private setInOutPoints = async (): Promise<void> => {
    if (!this.setPoints) return;
    if (!this.projectItem || !(this.projectItem instanceof ProjectItem)) {
      return console.error('projectItem is not initialized')
    }
    await this.projectItem.setInPoint(this.inPoint, 4)
    await this.projectItem.setOutPoint(this.outPoint, 4)
  }

  private getBinPath = (): string[] => {
    const dirPath = this.getDirName(this.fileTreeNode.path)
    const dirPathArray = dirPath.split('/').filter(entry => !!entry)
    return ['EditorHub', ...dirPathArray]
  }

  private getDirName = (path: string): string => {
    return path.replace(/[/\\][^/\\]*$/, '');
  }

  private createBinRecursive = async (binPathArray: string[]): Promise<ProjectItem> => {
    const initialBin = await ProjectItem.getRootItem()

    const sequentialPiping = binPathArray.map((folderName) => {
      return async (previousBin: ProjectItem): Promise<ProjectItem> => {
        const newBin = await previousBin.createBin(folderName, true)
        return newBin
      }
    })

    const finalBin = await sequentialPiping.reduce(
      (promiseChain, currentFunction) => promiseChain.then(currentFunction),
      Promise.resolve(initialBin) // Start with the initial bin
    );

    return finalBin;
  }
}
