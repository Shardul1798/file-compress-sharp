import express, { Express } from "express";
import { ICompressFile } from "../interfaces/compress-file.interface";
import { fileCompress } from "../controllers/file-compress.controller";

export class FileCompressApp {
  private app: Express;
  private port = 3000;
  constructor() {
    this.app = express();
    this.startApp();
  }

  startApp() {
    this.initializeServer();
  }

  private initializeServer() {
    this.app.listen(this.port, this.callback);
  }

  private callback = () => {
    console.log(`Server listing on port: ${this.port}`);
    this.loadFileController();
  };

  loadFileController() {
    const inputFilePath = process.argv[2];
    if (!inputFilePath) {
      console.error("Error: Please provide an input file path.");
      process.exit(1);
    }
    const paylaod: ICompressFile = {
      file: inputFilePath,
      size: 800,
      formats: ["jpeg", "heif", "webp", "avif"],
      quality: 90,
    };
    fileCompress.modifyFile(paylaod);
  }
}
