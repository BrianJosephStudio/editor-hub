import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { CompItem } from "./CompItem";
import { File } from "./File";
import { FolderItem } from "./FolderItem";
import { FootageItem } from "./FootageItem";
import { Item } from "./Item";
import { ItemCollection } from "./ItemCollection";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper();

interface ProjectObjectProps {
  file: File;
  numItems: number;
  rootFolder: FolderItem;
}

export class Project {
  public readonly file: File;
  public readonly numItems: number;
  public readonly rootFolder: FolderItem;

  private static instance: Project | undefined;

  private constructor({
    file,
    numItems,
    rootFolder,
  }: ProjectObjectProps) {
    this.file = file;
    this.numItems = numItems;
    this.rootFolder = rootFolder;
  }

  public readonly items = async (): Promise<ItemCollection> => {
    return this.rootFolder.items()
  };

  public readonly importFile = (
    path: string
  ): Promise<FootageItem | CompItem> => {
    return new Promise((resolve, reject) => {
      try {
        csInterface.evalScript(`_Project_importFile('${path}')`, (response) => {
          const responseObject = parseResponseObject(response);
          if (!responseObject.success)
            return reject("Something went wrong running _Project_importFile()");

          const importedItem = Item.getItemFromResponseData(
            responseObject.value
          );

          resolve(importedItem as FootageItem | CompItem);
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };

  public readonly activeItem = () => {}
  public readonly selection = () => {}

  public readonly item = (index: number) => Item.getByIndex(index);
  public readonly itemByID = (id: number) => Item.getByIndex(id);
  public readonly layerByID = () => {};
  public readonly save = () => {};
  public readonly showWindow = () => {};

  public static readonly getInstance = async (): Promise<Project> => {
    if (this.instance) return this.instance;

    try {
      const projectObjectProperties = await this.getProjectProperties();
      return new Project(projectObjectProperties);
    } catch (e) {
      throw new Error(e as any);
    }
  };

  private static readonly getProjectProperties =
    (): Promise<ProjectObjectProps> => {
      return new Promise<ProjectObjectProps>((resolve, reject) => {
        csInterface.evalScript("_getProjectProperties", (response) => {
          if (CSInterfaceWrapper.isEvalScriptError(response))
            reject(new Error(response));

          const projectPropertiesObject =
            this.parseProjectPropertiesObject(response);
          if (!projectPropertiesObject)
            return reject(
              "Something went wrong while attempting to fetch project properties"
            );

          resolve(projectPropertiesObject);
        });
      });
    };

  private static readonly parseProjectPropertiesObject = (
    extendScriptResponse: string
  ): ProjectObjectProps | null => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (
        !parsedResponse.file ||
        !parsedResponse.numItems ||
        !parsedResponse.rootFolder
      )
        return null;

      const rootFolder = Item.getItemFromResponseData(JSON.stringify(parsedResponse.rootFolder), 'Folder')
      if(!rootFolder) throw 'Could not parse root folder'
      const projectObjectProps: ProjectObjectProps = {
        file: parsedResponse.file,
        numItems: parsedResponse.numItems,
        rootFolder: rootFolder as FolderItem
      }

      return projectObjectProps;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
