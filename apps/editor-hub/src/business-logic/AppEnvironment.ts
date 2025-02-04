import { AppEnvironment } from "../types/app";
import { NodeWrapper } from "./node.wrapper";

const appEnvironmentFileName = '.editor-hub'

const productionEnvironment = 'https://editor-hub.brianure.com/editor-hub'
const qaEnvironment = 'https://qa.editor-hub.brianure.com/editor-hub'
const devEnvironment = 'https://dev.editor-hub.brianure.com/editor-hub'
const localhostEnvironment = 'http://localhost:5173/editor-hub'
const stagingEnvironment = 'http://localhost:5100/editor-hub'

export class AppEnvironmentClient {
    private readonly node: NodeWrapper
    public readonly appEnvironment: AppEnvironment

    constructor() {
        this.node = new NodeWrapper()
        this.appEnvironment = this.getAppEnvironment()
    }

    private readonly getAppEnvironmentFilePath = () => {
        if (!this.node.isNodeEnv) return '/'

        const homedir = this.node.os!.homedir()
        const documentsFolder = this.node.path!.join(homedir, 'Documents')
        const appEnvironmentFilePath = this.node.path!.join(documentsFolder, appEnvironmentFileName)

        return appEnvironmentFilePath
    }

    private readonly getAppEnvironment = (): AppEnvironment => {
        if (window.location.host.includes('qa')) return 'qa';
        if (window.location.host.includes('dev')) return 'dev';
        if (window.location.host.includes('localhost:5173')) return 'localhost';
        if (window.location.host.includes('localhost:5100')) return 'staging';
        return 'production'
    }

    public readonly setAppEnvironment = (newAppEnvironment: AppEnvironment) => {
        console.log("new", newAppEnvironment, newAppEnvironment === 'dev')
        if (newAppEnvironment === null) return;

        const appEnvironmentFilePath = this.getAppEnvironmentFilePath()

        if (newAppEnvironment === 'production') {
            if (this.node.isNodeEnv) this.node.fs?.writeFileSync(appEnvironmentFilePath, productionEnvironment);
            window.location.href = productionEnvironment
        };

        if (newAppEnvironment === 'qa') {
            if (this.node.isNodeEnv) this.node.fs?.writeFileSync(appEnvironmentFilePath, qaEnvironment);
            window.location.href = qaEnvironment
        };

        if (newAppEnvironment === 'dev') {
            if (this.node.isNodeEnv) this.node.fs?.writeFileSync(appEnvironmentFilePath, devEnvironment);
            window.location.href = devEnvironment
        };

        if (newAppEnvironment === 'localhost') {
            if (this.node.isNodeEnv) this.node.fs?.writeFileSync(appEnvironmentFilePath, localhostEnvironment);
            window.location.href = localhostEnvironment
        };

        if (newAppEnvironment === 'staging') {
            if (this.node.isNodeEnv) this.node.fs?.writeFileSync(appEnvironmentFilePath, stagingEnvironment);
            window.location.href = stagingEnvironment
        };
    }
}