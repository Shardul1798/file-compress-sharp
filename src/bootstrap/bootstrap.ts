import { FileCompressApp } from "./app";


export class Bootstrap {
    private app!: FileCompressApp;

    constructor() {
        this.startApplication();
    }

    public async startApplication() {
        this.app = new FileCompressApp();
    }
}