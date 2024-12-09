import { v4 as uuid } from "uuid";
import { CSInterfaceWrapper } from "../CSInterface.wrapper";

interface ProjectItemParams {
  name: string;
  nodeId: string;
  type: number;
}

export class ProjectItem {
  public name: string;
  public nodeId: string;
  public type: number;
  private referenceId: string
  private static csInterface = new CSInterfaceWrapper();

  private constructor({ name, nodeId, type }: ProjectItemParams, referenceId: string) {
    this.name = name;
    this.nodeId = nodeId;
    this.type = type;
    this.referenceId = referenceId
  }

  public createBin = async (name: string): Promise<ProjectItem> => {
    return new Promise((resolve) => {
      const referenceId = uuid()
      ProjectItem.csInterface.evalScript(
        `createBin("${name}", "${this.nodeId}", "${referenceId}")`,
        (response) => {
          console.log(response);
          const result = JSON.parse(response)
          ProjectItem.getProjectItemByNodeId(result.nodeId).then((projectItem) => {
            resolve(projectItem);
          })
        }
      );
    });
  };

  getChildrenParamsArray = async (): Promise<ProjectItemParams[]> => {
    return new Promise((resolve, reject) => {
      ProjectItem.csInterface.evalScript(`getProjectItemChildren("${this.referenceId}")`, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response)) {
          reject(response);
        }

        const projectItemParamsArray = ProjectItem.resolveProjectItemArray(response)
        if (!projectItemParamsArray) return reject(response);

        resolve(projectItemParamsArray)
      })
    })
  }

  getChildByName = async (name: string): Promise<ProjectItem | undefined> => {
    return new Promise(async (resolve, _reject) => {
      const childrenParamsArray = await this.getChildrenParamsArray()

      const foundProjectitemParams = childrenParamsArray.find((childrenParams) => {
        return childrenParams.name === name
      })

      const referenceId = uuid()

      if (!foundProjectitemParams) return resolve(undefined)
      const projectItem = new ProjectItem(foundProjectitemParams, referenceId)

      resolve(projectItem)
    })
  }

  /* STATIC PROPERTIES */

  static getRootItem = async (): Promise<ProjectItem> => {
    return new Promise((resolve, reject) => {
      const referenceId = uuid()
      this.csInterface.evalScript(`getRootItem("${referenceId}")`, (response) => {
        if (CSInterfaceWrapper.isEvalScriptError(response)) {
          reject(response);
        }
        const projectItemParams = ProjectItem.resolveProjectItem(response);
        if (!projectItemParams) return reject(response);
        const rootItem = new ProjectItem(projectItemParams, referenceId);
        resolve(rootItem);
      });
    });
  };

  static getProjectItemByNodeId = async (
    nodeId: string
  ): Promise<ProjectItem> => {
    return new Promise((resolve, reject) => {
      const referenceId = uuid()
      this.csInterface.evalScript(
        `
          findProjectItemByNodeId("${nodeId}", undefined, "${referenceId}")
        `,
        (response) => {
          console.log(response);
          if (CSInterfaceWrapper.isEvalScriptError(response)) {
            return reject(response);
          }
          const projectItemParams = ProjectItem.resolveProjectItem(response);
          if (!projectItemParams) return reject(response);
          const projectItem = new ProjectItem(projectItemParams, referenceId);
          resolve(projectItem);
        }
      );
    });
  };

  static getProjectItemBySourcePath = async (
    filePath: string
  ): Promise<ProjectItem> => {
    return new Promise((resolve, reject) => {
      const referenceId = uuid()
      this.csInterface.evalScript(
        `getProjectItemBySourcePath("${filePath}", "${referenceId}")`,
        (response) => {
          if (CSInterfaceWrapper.isEvalScriptError(response)) {
            return reject(response);
          }
          const foundProjectItem = ProjectItem.resolveProjectItem(response);
          if (!foundProjectItem) return reject(response);
          const projectItem = new ProjectItem(foundProjectItem, referenceId);
          resolve(projectItem);
        }
      );
    });
  };

  static resolveProjectItem = (
    extendScriptResponse: string
  ): ProjectItemParams | undefined => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (
        parsedResponse.name &&
        parsedResponse.nodeId &&
        parsedResponse.type &&
        parsedResponse.name instanceof String &&
        parsedResponse.nodeIde instanceof Number &&
        parsedResponse.type instanceof String
      ) {
        return {
          name: parsedResponse.name,
          nodeId: parsedResponse.nodeIde,
          type: parsedResponse.type,
        };
      }
    } catch (e) {
      console.error(e);
    }
  };

  static resolveProjectItemArray = (
    extendScriptResponse: string
  ): ProjectItemParams[] | undefined => {
    try {
      const parsedResponse = JSON.parse(extendScriptResponse);
      if (!Array.isArray(parsedResponse)) {
        throw new Error("is not array")
      }
      const projectItemArray = parsedResponse.map((projectItem) => {
        if (
          projectItem.name &&
          projectItem.nodeId &&
          projectItem.type &&
          projectItem.name instanceof String &&
          projectItem.nodeId instanceof Number &&
          projectItem.type instanceof String
        ) {
          return {
            name: projectItem.name,
            nodeId: projectItem.nodeIde,
            type: projectItem.type,
          };
        }
        throw new Error("is not project item params")
      })
      return projectItemArray
    } catch (e) {
      console.error(e);
    }
  };
}
