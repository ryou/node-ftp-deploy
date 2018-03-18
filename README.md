# node-ftp-deploy

指定したディレクトリ以下のファイルをFTPでアップロード

## 使い方

### インストール

```
npm i https://github.com/ryou/node-ftp-deploy.git
```

### コード

```
const ftpDeploy = require('ftp-deploy');

ftpDeploy({
  local: {
    targetDir: './dist',
  },
  ftp: {
    host: 'example.com',
    user: 'example',
    password: 'example',
    targetDir: 'www/example.com',
  },
});
```

FTPの情報は、Git管理していない`.env`ファイル等を経由して引っ張ってきたほうがいい。
