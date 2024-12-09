import { Project } from "./premire-api/classes/Project";
import { ProjectItem } from "./premire-api/classes/ProjectItem";

export class PremiereApi {
  importResource = async (filePath: string, binPathArray: string[]) => {
    const project = await Project.getInstance()

    const createdBin = await this.createBinRecursive(binPathArray)
    if (!createdBin) {
      return console.error(createdBin, createdBin)
    }
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
