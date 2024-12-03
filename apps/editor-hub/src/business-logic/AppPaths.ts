import { NodeWrapper } from "./node.wrapper";

export class AppPaths{
    public editorHub_documents: string
    public resources: string
    public videoResources: string
    public inGameFootage: string

    constructor() {
        const node = new NodeWrapper()
        this.editorHub_documents = `${node.os.homedir()}/Documents/Editor Hub`
        this.resources = `${this.editorHub_documents}/resources`
        this.videoResources = `${this.resources}/video`
        this.inGameFootage = `${this.videoResources}/ingameFootage`
    }
}