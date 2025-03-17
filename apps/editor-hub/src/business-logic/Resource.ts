import { NodeWrapper } from "./node.wrapper";
import { FileTreeNode } from "../types/app";
import apiClient from "../api/ApiClient";
import { CSInterfaceWrapper } from "./premire-api/CSInterface.wrapper";
import { PremiereResource } from "./app-specific-resource/PremiereResource";
import { AfterEffectsResource } from "./app-specific-resource/AfterEffectsResource";
import { DownloadLocation } from "../contexts/Settings.context";
import { AppPaths } from "./AppPaths";

const { isNodeEnv, fsPromises } = new NodeWrapper();

type ResourceType = 'in-game' | 'music' | 'sfx' | 'template'

export class Resource {
  public readonly fileTreeNode: FileTreeNode;
  public readonly resourcePath: string;
  public readonly uri: string;
  public readonly folderPath: string;
  public binPathArray: string[]
  public resourceType: ResourceType
  private premiereResource: PremiereResource
  private afterEffectsResource: AfterEffectsResource

  constructor(fileTreeNode: FileTreeNode, resourcePath: string) {
    this.fileTreeNode = fileTreeNode;
    this.resourcePath = resourcePath;
    this.uri = `${this.resourcePath}${this.fileTreeNode.path}`;
    this.folderPath = Resource.getDirName(this.uri)
    this.binPathArray = this.getBinPath()
    this.resourceType = Resource.getResourceType(this.fileTreeNode.metadata!.path_lower!)
    this.premiereResource = new PremiereResource()
    this.afterEffectsResource = new AfterEffectsResource()
  }

  download = async () => {
    if (!this.fileTreeNode.metadata || !this.fileTreeNode.metadata.path_lower) throw new Error("Missing metadata")
    const data = await apiClient.download(
      this.fileTreeNode.metadata.path_lower
    );

    if (!isNodeEnv) return console.log("File Download was triggered for ", this.fileTreeNode.name);

    const buffer = Buffer.from(data);
    const uint8Array = new Uint8Array(buffer);

    try {
      await fsPromises!.access(this.folderPath, 0);
    } catch (e: any) {
      await fsPromises!.mkdir(this.folderPath, { recursive: true });
    }

    try {
      await fsPromises!.access(this.uri, 0);
    } catch (e: any) {
      await fsPromises!.writeFile(this.uri, uint8Array);
    }
  };

  import = async () => {
    if (!isNodeEnv) return console.log("Import function has been triggered for ", this.fileTreeNode.name);

    const { hostEnvironment: { appId } } = new CSInterfaceWrapper()

    try {
      if (appId === "PPRO") {
        this.premiereResource.import(this.uri, this.binPathArray)
      }
      if (appId === "AEFT") {
        this.afterEffectsResource.import(this.fileTreeNode.name, this.uri, this.binPathArray)
      }
    } catch (e) {
      console.error(e)
    }
  };

  public static getProjectPath = async () => {
    const { hostEnvironment: { appId } } = new CSInterfaceWrapper()

    if (appId === "PPRO") {
      return PremiereResource.getProjectPath()
    }
    if (appId === "AEFT") {
      return AfterEffectsResource.getProjectPath()
    }
    throw 'App Id did not match expected value'
  }

  private getBinPath = (): string[] => {
    const dirPath = Resource.getDirName(this.fileTreeNode.path)
    const dirPathArray = dirPath.split('/').filter(entry => !!entry)
    const categoryFolder = this.fileTreeNode.metadata?.path_lower?.split(`/${dirPathArray[0]}`)[0].split("/").pop()!
    return ['EditorHub', categoryFolder, ...dirPathArray]
  }

  public static getDirName = (path: string): string => {
    return path.replace(/[/\\][^/\\]*$/, '') || path;
  }

  private static readonly getResourceType = (resourcePath: string): ResourceType => {
    if (resourcePath.includes('ingamefootage')) return 'in-game';
    if (resourcePath.includes('music')) return 'music';
    if (resourcePath.includes('sfx')) return 'sfx';
    if (resourcePath.includes('template')) return 'template';
    throw 'resource type could not be identified'
  }

  public static readonly getInstance = async (fileTreeNode: FileTreeNode, downloadLocation: DownloadLocation) => {
    const appPaths = new AppPaths()
    const resourceType = this.getResourceType(fileTreeNode.metadata!.path_lower!)
    const projectPath = await this.getProjectPath()
    let resourcePath: string
    let projectResourceFolder = `${projectPath}/Editor Hub Resources`

    switch (resourceType) {
      case 'in-game':
        resourcePath = appPaths.inGameFootage
        projectResourceFolder += `/video`
        break;
      case 'music':
        resourcePath = appPaths.musicResources
        projectResourceFolder += `/music`
        break;
      case 'sfx':
        resourcePath = appPaths.sfxResources
        projectResourceFolder += `/sfx`
        break;
      case 'template':
        resourcePath = appPaths.templates
        projectResourceFolder += `/templates`
        break;
      default:
        throw 'resource type could not be identified';
    }

    if (downloadLocation === 'projectFolder' && projectPath !== null)
      return new Resource(fileTreeNode, projectResourceFolder);

    return new Resource(fileTreeNode, resourcePath);
  }
}
