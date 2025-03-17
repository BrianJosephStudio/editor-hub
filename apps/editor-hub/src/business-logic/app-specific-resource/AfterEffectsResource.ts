import { FolderItem } from "../after-effects-api/FolderItem";
import { FootageItem } from "../after-effects-api/FootageItem";
import { Item } from "../after-effects-api/Item";
import { Project } from "../after-effects-api/Project";
import { FolderItemProps, ItemObjectProps, TypeName } from "../after-effects-api/types";
import { Resource } from "../Resource";


export class AfterEffectsResource {
  private setPoints: boolean = false //TODO: wip 
  private inPoint: number = 2 //TODO: wip
  private outPoint: number = 10 //TODO: wip

  public static readonly getProjectPath = async (): Promise<string | null> => {
    const project = await Project.getInstance()

    const projectFsName = await project.getProjectFsName()
    if (projectFsName === null) return null;
    const projectPath = Resource.getDirName(projectFsName)
    return projectPath
  }

  public readonly import = async (name: string, uri: string, binPathArray: string[]) => {
    try {
      const project = await Project.getInstance()

      const resourceParentFolder = await this.createBinRecursive(binPathArray)

      const existingItem = await this.getItemByName(project, name, undefined, resourceParentFolder)
      if (
        existingItem &&
        !FootageItem.assertFootageItem(existingItem) &&
        !FolderItem.assertFolderItem(existingItem)
      ) throw new Error("item is not of expected type");

      if (existingItem) return existingItem.setSelected(true);
      const importedFile = await project.importFile(uri)
      
      await importedFile.setParentFolder(resourceParentFolder)
      await importedFile.setSelected(true)
      return
    } catch (e) {
      console.error(e)
    }
  };

  private setInOutPoints = async (): Promise<void> => {
  }


  private createBinRecursive = async (binPathArray: string[]): Promise<FolderItem> => {
    const project = await Project.getInstance()
    const initialBin = project.rootFolder

    const sequentialPiping = binPathArray.map((folderName) => {
      return async (previousFolder: FolderItem): Promise<FolderItem> => {
        const items = await previousFolder.items()
        const existingFolderProps = items.entries.find((entry) => {
          const itemProps = entry as ItemObjectProps
          if (!itemProps.typeName || !itemProps.name || itemProps.typeName !== 'Folder' || itemProps.name !== folderName) return false;
          return true
        })
        if (existingFolderProps && FolderItem.isFolderItem(JSON.stringify(existingFolderProps))) return new FolderItem(existingFolderProps as FolderItemProps);
        const newFolder = await items.addFolder(folderName)
        return newFolder
      }
    })

    const finalFolder = await sequentialPiping.reduce(
      (promiseChain, currentFunction) => promiseChain.then(currentFunction),
      Promise.resolve(initialBin) // Start with the initial bin
    );

    return finalFolder;
  }

  private readonly getItemByName = async (project: Project, name: string, typeName?: TypeName, parentFolder?: FolderItem): Promise<Item | undefined> => {
    const startingFolder = parentFolder ?? project.rootFolder
    const childItems = await startingFolder.items()
    const foundItem = childItems.entries.find((entry) => {
      const item = entry as Item
      if (item.name.toLowerCase() === name.toLowerCase()) {
        if (!typeName || typeName === item.typeName) return true
      }
      if (item.typeName === 'Folder') {
        return this.getItemByName(project, name, typeName, new FolderItem(entry as FolderItemProps))
      }
    })

    if (foundItem) return foundItem as Item
  }
}
