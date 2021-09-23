const fs = require('fs');

/**
 * To be responsible of storage service.
 */
class StorageService {
  /**
   * Construct to create folder.
   * @param {*} folder Param represent of folder.
   */
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }
  }

  /**
   * Write file.
   * @param {*} file Param represent of file.
   * @param {*} meta Param represent of meta.
   * @return {*} Return is promise of file.
   */
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
