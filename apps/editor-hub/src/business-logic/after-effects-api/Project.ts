import { CSInterfaceWrapper } from "../premire-api/CSInterface.wrapper";
import { AVItem } from "./AVItem";
import { CompItem } from "./CompItem";
import { File } from "./File";
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
  file: File;
  rootFolder: FolderItem;
}

export class Project {
  public readonly file: File;
  public readonly rootFolder: FolderItem;

  private static instance: Project | undefined;

  private constructor({ file, rootFolder }: ProjectObjectProps) {
    this.file = file;
    this.rootFolder = rootFolder;
  }

  public readonly items = async (): Promise<ItemCollection> => {
    return this.rootFolder.items();
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

  public readonly activeItem = () => {};
  public readonly selection = () => {};

  public readonly item = (index: number) => Project.getByIndex(index);
  public readonly itemByID = (id: number) => Project.getByIndex(id);
  public readonly layerByID = () => {};
  public readonly save = () => {};
  public readonly showWindow = () => {};

  /**STATIC METHODS */
  public static readonly getInstance = async (): Promise<Project> => {
    if (this.instance) return this.instance;
    await csInterface.declareJSXFunctions();

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

    console.log("itemProps", itemProps);

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
      parsedResponse.file === undefined ||
      parsedResponse.rootFolder === undefined
    )
      throw "projectData did not match ProjectProps schema";

    const rootFolder = this.getItemFromResponseData(
      JSON.stringify(parsedResponse.rootFolder),
      "Folder"
    );

    if (!rootFolder) throw "Could not parse root folder";
    const projectObjectProps: ProjectObjectProps = {
      file: parsedResponse.file,
      rootFolder: rootFolder as FolderItem,
    };

    return projectObjectProps;
  };
}
