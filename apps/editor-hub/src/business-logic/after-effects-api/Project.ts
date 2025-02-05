import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { AVItem } from "./AVItem";
import { CompItem } from "./CompItem";
import { FolderItem } from "./FolderItem";
import { FootageItem } from "./FootageItem";
import { Item } from "./Item";
import { ItemCollection } from "./ItemCollection";
import {
  CompItemProps,
  FolderItemProps,
  FootageItemProps,
  TypeName,
} from "./types";
import { parseResponseObject } from "./util";

const csInterface = new CSInterfaceWrapper();

interface ProjectObjectProps {
  rootFolder: FolderItem;
}

export class Project {
  public readonly rootFolder: FolderItem;

  private static instance: Project | undefined;

  private constructor({ rootFolder }: ProjectObjectProps) {
    this.rootFolder = rootFolder;
  }

  public readonly items = async (): Promise<ItemCollection> => {
    return this.rootFolder.items();
  };

  public readonly getProjectFsName = () => {
    return new Promise<string | null>((resolve, reject) => {
      try{
        csInterface.evalScript(`_Project_getProjectFsName()`, response => {
          const responseObject = parseResponseObject(response);

          if (!responseObject.success)
            return reject("Something went wrong running _Project_getProjectFsName()");

          const parsedValue = JSON.parse(responseObject.value) as string

          if(parsedValue === null) return resolve(null);

          const projectPath = parsedValue.replace(/\\/g, '/')

          resolve(projectPath)
        })
      }catch(e){
        console.error(e)
        reject(e)
      }
    })
  }

  public readonly importFile = (
    path: string
  ): Promise<FootageItem | CompItem> => {
    return new Promise((resolve, reject) => {
      try {
        console.log("path", path)
        csInterface.evalScript(`_Project_importFile('${path}')`, (response) => {
          const responseObject = parseResponseObject(response);
          if (!responseObject.success)
            return reject("Something went wrong running _Project_importFile()");

          const importedItem = Project.getItemFromResponseData(
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

  public readonly activeItem = () => { };
  public readonly selection = () => { };

  public readonly item = (index: number) => Project.getByIndex(index);
  public readonly itemByID = (id: number) => Project.getByIndex(id);
  public readonly layerByID = () => { };
  public readonly save = () => { };
  public readonly showWindow = () => { };

  /**STATIC METHODS */
  public static readonly getInstance = async (): Promise<Project> => {
    if (!this.instance) {
      await csInterface.declareJSXFunctions();

      try {
        const projectObjectProperties = await this.getProjectProperties();
        this.instance = new Project(projectObjectProperties);
      } catch (e) {
        throw new Error(e as any);
      }
    }
    return this.instance;
  };

  private static readonly getProjectProperties =
    (): Promise<ProjectObjectProps> => {
      return new Promise<ProjectObjectProps>((resolve, reject) => {
        try {
          csInterface.evalScript(
            "_Project_getProjectProperties()",
            (response) => {
              const parsedResponse = parseResponseObject(response);
              if (!parsedResponse.success)
                throw "Something went wrong while attempting to fetch project properties";

              const projectPropertiesObject = this.parseProjectPropertiesObject(
                parsedResponse.value
              );
              if (!projectPropertiesObject)
                throw "Could not parse project properties object";
              resolve(projectPropertiesObject);
            }
          );
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    };

  public static readonly getByIndex = async (
    index: number
  ): Promise<Item | null> => {
    return new Promise((resolve, reject) => {
      csInterface.evalScript(`app.project.item(${index})`, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response))
          reject(new Error(response));

        try {
          const createdItem = this.getItemFromResponseData(response);
          resolve(createdItem);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  public static readonly getByID = async (id: number): Promise<Item | null> => {
    return new Promise((resolve, reject) => {
      csInterface.evalScript(`app.project.itemByID(${id})`, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response))
          reject(new Error(response));

        try {
          const createdItem = this.getItemFromResponseData(response);
          resolve(createdItem);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  public static readonly getItemFromResponseData = (
    responseData: string,
    expectedTypeName?: TypeName
  ): FootageItem | CompItem | FolderItem | null => {
    const typeName = this.validateTypeName(responseData);
    if (!typeName) throw new Error("Could not find typeName");
    if (expectedTypeName && expectedTypeName !== typeName) return null;

    const itemProps = JSON.parse(responseData);

    switch (typeName) {
      case "Footage":
        return new FootageItem(itemProps as FootageItemProps);
      case "Composition":
        return new CompItem(itemProps as CompItemProps);
      case "Folder":
        return new FolderItem(itemProps as FolderItemProps);
      default:
        throw new Error("Could not find typeName");
    }
  };

  private static readonly validateTypeName = (
    extendScriptResponse: string
  ): TypeName | null => {
    const isProjectItem = Item.isProjectItem(extendScriptResponse);
    if (!isProjectItem) return null;

    const isAVItem = AVItem.isAVItem(extendScriptResponse);
    if (isAVItem) {
      const isFootageItem = FootageItem.isFootageItem(extendScriptResponse);
      if (isFootageItem) return "Footage";
      const isCompItem = CompItem.isCompItem(extendScriptResponse);
      if (isCompItem) return "Composition";

      return null;
    }
    const isFolderItem = FolderItem.isFolderItem(extendScriptResponse);
    if (isFolderItem) return "Folder";
    return null;
  };

  private static readonly parseProjectPropertiesObject = (
    projectData: string
  ): ProjectObjectProps => {
    const parsedResponse = JSON.parse(projectData);
    if (
      parsedResponse.rootFolder === undefined
    )
      throw "projectData did not match ProjectProps schema";

    const rootFolder = this.getItemFromResponseData(
      JSON.stringify(parsedResponse.rootFolder),
      "Folder"
    );

    if (!rootFolder) throw "Could not parse root folder";
    const projectObjectProps: ProjectObjectProps = {
      rootFolder: rootFolder as FolderItem,
    };

    return projectObjectProps;
  };
}
