import sharp from "sharp";
import { ICompressFile } from "../interfaces/compress-file.interface";
import { FILE_TYPE } from "../constants/enums/files.enum";
const convert = require("heic-convert");
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');

class NewFileCompressor {
  constructor() {}

  async modifyFile(paylaod: ICompressFile) {
    try {
      let { file, size, formats, quality } = paylaod;
      const extension = await this.getExtension(file);
      if (extension == FILE_TYPE.HEIF || extension == 'HEIC') {
        const inputBuffer = await promisify(fs.readFile)(file);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 1,
        });
        file = outputBuffer;
        await promisify(fs.writeFile)('./result.jpg', outputBuffer);
        file = "./result.jpg";
      }
      if (formats && formats.length) {
        formats.forEach((format) => {
          fs.mkdirSync(`output/${format}`, { recursive: true });
          const outputFilename = `${Date.now()}-${size}-${quality}.${format}`;
          const outputFile = path.join(`output/${format}`, outputFilename);
          let options: any = {
            quality: quality,
            lossless: true,
            progressive: true,
          };
          switch (format) {
            case FILE_TYPE.AVIF:
              delete options.progressive;
              break;
            case FILE_TYPE.HEIF:
              delete options.progressive;
              options.compression = "av1";
              break;
            case FILE_TYPE.WEBP:
              delete options.progressive;
              break;
            case FILE_TYPE.JPEG:
              delete options.lossless;
              break;
          }
          sharp(file)
            .resize(size)
            .toFormat(format, options)
            .toBuffer({ resolveWithObject: true })
            .then(({ data }) => {
              return sharp(data).toFile(outputFile);
            })
            .then((info) => {
              console.log("Metadata removed successfully:", info);
            })
            .catch((err) => {
              console.error("Error:", err);
            });
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getExtension(filePath: string) {
    const parts = filePath.split(".");
    return parts[parts.length - 1] || "";
  }
}

export const fileCompress = new NewFileCompressor();
