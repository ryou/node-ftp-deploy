const Client = require('ftp');
const Path = require('path');

module.exports = class {
  constructor(options) {
    this.host = options.host;
    this.user = options.user;
    this.password = options.password;

    // 操作対象となるディレクトリの絶対パス
    this.targetDirAbsPath = null;

    this.client = new Client();
  }

  start(targetDirRelPath = '') {
    return new Promise((resolve, reject) => {
      this.client.connect({
        host: this.host,
        user: this.user,
        password: this.password,
      });
      this.client.on('ready', async () => {
        const currentDir = await this.pwd();
        this.targetDirAbsPath = Path.resolve(currentDir, targetDirRelPath);

        const list = await this.list(this.targetDirAbsPath);
        resolve(list);
      });
      this.client.on('error', reject);
    });
  }

  end() {
    this.client.end();
  }

  /* 操作対象ディレクトリからの相対パスで指定可能なmkdir
   * 例えば
   * localPath:
  ----------------------------------------------------------*/
  async mkdirByRelativePath(directoryPath) {
    const directoryAbsPath = Path.resolve(this.targetDirAbsPath, directoryPath);

    try {
      await this.list(directoryAbsPath);
      console.log(`directory ${directoryAbsPath} already exist.`);
    } catch (err) {
      await this.mkdir(directoryAbsPath);
    }
  }

  async putByRelativePath(input, filePath) {
    const fileAbsPath = Path.resolve(this.targetDirAbsPath, filePath);
    const result = await this.put(input, fileAbsPath);

    return result;
  }

  /* 以下、ftpパッケージの各関数をPromise対応に書き直した物
  ----------------------------------------------------------*/
  list(path) {
    return new Promise((resolve, reject) => {
      this.client.list(path, (err, list) => {
        if (err) reject(err);
        resolve(list);
      });
    });
  }

  pwd() {
    return new Promise((resolve, reject) => {
      this.client.pwd((err, directory) => {
        if (err) reject(err);
        resolve(directory);
      });
    });
  }

  cwd(path) {
    return new Promise((resolve, reject) => {
      this.client.cwd(path, (err) => {
        if (err) reject(err);

        console.log(`cd ${path}`);
        resolve();
      });
    });
  }

  mkdir(path) {
    return new Promise((resolve, reject) => {
      this.client.mkdir(path, (err) => {
        if (err) reject(err);

        console.log(`mkdir ${path}`);
        resolve();
      });
    });
  }

  put(input, destPath) {
    return new Promise((resolve, reject) => {
      console.log(`put to ${destPath}`);
      this.client.put(input, destPath, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
};
