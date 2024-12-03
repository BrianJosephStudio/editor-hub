import { NodeWrapper } from "./node.wrapper";
import { FileTreeNode } from "../types/app";
import { ApiClient } from "../api/ApiClient";
import { PremiereApi } from "./PremiereApi";

const node = new NodeWrapper()

export class Resource {
    public fileTreeNode: FileTreeNode
    public resourcePath: string
    public uri: string
    public folderPath: string
    private premiereApi: PremiereApi

    constructor(fileTreeNode: FileTreeNode, resourcePath: string){
        this.fileTreeNode = fileTreeNode
        this.resourcePath = resourcePath
        this.uri = `${this.resourcePath}/${this.fileTreeNode.path}`
        this.folderPath = node.path.dirname(this.uri)
        this.premiereApi = new PremiereApi()
    }
    download = async () => {
        const apiClient = new ApiClient()
        const data = await apiClient.download(this.fileTreeNode.metadata.path_lower)
        const buffer = Buffer.from(data);
        
        await node.fsPromises.mkdir(this.folderPath, {recursive: true})
        return node.fsPromises.writeFile(this.uri, buffer)
    };
    
    import = async () => {
        const response = await this.premiereApi.importResource(this.uri)
    }
}