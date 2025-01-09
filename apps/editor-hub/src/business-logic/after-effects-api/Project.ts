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
  activeItem: Item;
  file: File;
  items: ItemCollection;
  numItems: number;
  rootFolder: FolderItem;
  selection: Item[];
}

export class Project {
  public readonly activeItem: Item;
  public readonly file: File;
  public readonly items: ItemCollection;
  public readonly numItems: number;
  public readonly rootFolder: FolderItem;
  public readonly selection: Item[];

  static instance: Project | undefined;

  private constructor({
    activeItem,
    file,
    items,
    numItems,
    rootFolder,
    selection,
  }: ProjectObjectProps) {
    this.activeItem = activeItem;
    this.file = file;
    this.items = items;
    this.numItems = numItems;
    this.rootFolder = rootFolder;
    this.selection = selection;
  }

  public readonly importFile = (path: string): Promise<FootageItem | CompItem> => {
    return new Promise((resolve, reject) => {
      try{
        csInterface.evalScript(`_Project_importFile('${path}')`, (response) => {
          const responseObject = parseResponseObject(response)
          if(!responseObject.success)
            return reject('Something went wrong running _Project_importFile()')
          
          const importedItem = Item.getItemFromResponseData(responseObject.value)

          resolve(importedItem as FootageItem | CompItem)
        })
        
      }catch(e){
        console.error(e)
        reject(e)
      }
      
    })
  };

  public readonly item = (index: number) =>  Item.getByIndex(index)
  public readonly itemByID = (id: number) => Item.getByIndex(id)
  public readonly layerByID = () => {};
  public readonly save = () => {};
  public readonly showWindow = () => {};

  static readonly getInstance = async (): Promise<Project> => {
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
        !parsedResponse.activeItem ||
        !parsedResponse.file ||
        !parsedResponse.items ||
        !parsedResponse.numItems ||
        !parsedResponse.rootFolder ||
        !parsedResponse.selection
      )
        return null;

      return parsedResponse as ProjectObjectProps;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
