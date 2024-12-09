import { Project } from "./premire-api/classes/Project";
import { ProjectItem } from "./premire-api/classes/ProjectItem";

export class PremiereApi {
  importResource = async (filePath: string, targetBin: ProjectItem) => {
    const project = await Project.getInstance()

    const createBinResponse = await project.rootItem.createBin("Editor Hub") as any
    if (!createBinResponse.success) {
      return console.log(createBinResponse.message)
    }
    const createdBin = await ProjectItem.getProjectItemByNodeId(createBinResponse.nodeId)
    await project.importFile(filePath, true, createdBin, false)
  };

  createBinRecursive = async (binPathArray: string[]): Promise<ProjectItem> => {
    const initialBin = await ProjectItem.getRootItem()

    const sequentialPiping = binPathArray.map((folderName) => {
      return async (previousBin: ProjectItem): Promise<ProjectItem> => {
        const newBin = await previousBin.createBin(folderName)
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
