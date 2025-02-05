import { NodeWrapper } from "./node.wrapper";

export class AppPaths{
    public editorHub_documents: string
    public resources: string
    public audioResources: string
    public musicResources: string
    public sfxResources: string
    public videoResources: string
    public inGameFootage: string

    constructor() {
        const node = new NodeWrapper()
        let homedir: string = ""
        if(node.isNodeEnv) homedir = node.os!.homedir().replace(/\\/g, "/");
        else homedir = window.name
        
        this.editorHub_documents = `${homedir}/Documents/Editor Hub`
        this.resources = `${this.editorHub_documents}/resources`
        this.videoResources = `${this.resources}/video`
        this.inGameFootage = `${this.videoResources}/ingameFootage`
        this.audioResources = `${this.resources}/audio`
        this.musicResources = `${this.audioResources}/music`
        this.sfxResources = `${this.audioResources}/sfx`
    }
}