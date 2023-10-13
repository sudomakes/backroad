export class UploadManager {
  #filesMap: Record<string, Express.Multer.File[]> = {};

  setFiles(id: string, files: Express.Multer.File[]) {
    this.#filesMap[id] = files;
    return files.map((file) => file.filename);
  }
  getFiles(id: string) {
    return this.#filesMap[id] || [];
  }
}
