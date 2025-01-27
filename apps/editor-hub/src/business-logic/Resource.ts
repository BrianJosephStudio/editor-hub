import { NodeWrapper } from "./node.wrapper";
import { FileTreeNode } from "../types/app";
import apiClient from "../api/ApiClient";
import { CSInterfaceWrapper } from "./premire-api/CSInterface.wrapper";
import { PremiereResource } from "./app-specific-resource/PremiereResource";
import { AfterEffectsResource } from "./app-specific-resource/AfterEffectsResource";

const { isNodeEnv, fsPromises } = new NodeWrapper();

export class Resource {
  public readonly fileTreeNode: FileTreeNode;
  public readonly resourcePath: string;
  public readonly uri: string;
  public readonly folderPath: string;
  public binPathArray: string[]
  private premiereResource: PremiereResource
  private afterEffectsResource: AfterEffectsResource

  constructor(fileTreeNode: FileTreeNode, resourcePath: string) {
    this.fileTreeNode = fileTreeNode;
    this.resourcePath = resourcePath;
    this.uri = `${this.resourcePath}${this.fileTreeNode.path}`;
    this.folderPath = this.getDirName(this.uri)
    this.binPathArray = this.getBinPath()
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

    await fsPromises!.mkdir(this.folderPath, { recursive: true });
    try {
      await fsPromises!.access(this.uri, fsPromises!.constants.R_OK);
    } catch {
      await fsPromises!.writeFile(this.uri, uint8Array);
    }
  };

  import = async () => {
    if (!isNodeEnv) return console.log("Import function has been triggered for ", this.fileTreeNode.name);

    const {hostEnvironment: {appId}} = new CSInterfaceWrapper()

    if(appId === "PPRO"){
      this.premiereResource.import(this.uri, this.binPathArray)
    }
    if(appId === "AEFT"){
      this.afterEffectsResource.import(this.uri, this.binPathArray)
      }
  };

  private getBinPath = (): string[] => {
    const dirPath = this.getDirName(this.fileTreeNode.path)
    const dirPathArray = dirPath.split('/').filter(entry => !!entry)
    const categoryFolder = this.fileTreeNode.metadata?.path_lower?.split(`/${dirPathArray[0]}`)[0].split("/").pop()!
    return ['EditorHub', categoryFolder, ...dirPathArray]
  }

  private getDirName = (path: string): string => {
    return path.replace(/[/\\][^/\\]*$/, '');
  }
}
