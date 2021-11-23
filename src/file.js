const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

class File {
  constructor() {}

  /**
   * csvファイルを読み込む
   * @param {string} filePath
   * @returns {Promise}
   */
  static read(filePath) {
    return new Promise((resolve, reject) => {
      try {
        let data = fs.readFileSync(filePath, { encoding: 'utf8' });

        // BOM (Byte Order Mark) を削除
        if (data.charCodeAt(0) === 0xFEFF) {
          data = data.substr(1);
        }

        resolve(parse(data, { columns: false }));
      } catch(e) {
        console.error('failed to parse csv data');
        reject(e);
      }
    });
  }

  static write(data, file) {
    return new Promise((resolve, reject) => {
      try {
        const stringifiedData = stringify(data, { header: true });
        fs.writeFileSync(file, stringifiedData, { encoding: 'utf8' });
        resolve(stringifiedData);
      } catch(e) {
        console.error('failed to write file');
        reject(e);
      }
    });
  }

}

module.exports = File;
