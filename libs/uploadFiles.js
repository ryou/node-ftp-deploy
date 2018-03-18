const Client = require('./async-ftp');
const Path = require('path');

const uploadDirectory = async (client, data, localBaseDir) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    const relativePath = Path.relative(localBaseDir, item.name);
    if (item.type === 'directory') {
      // eslint-disable-next-line no-await-in-loop
      await client.mkdirByRelativePath(relativePath);

      // eslint-disable-next-line no-await-in-loop
      await uploadDirectory(client, item.items, localBaseDir);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await client.putByRelativePath(item.name, relativePath);
    }
  }

  return true;
};

const uploadFiles = async (client, data, localBaseDir) => {
  await uploadDirectory(client, data, localBaseDir);
};

module.exports = async (data, options) => {
  const client = new Client({
    host: options.ftp.host,
    user: options.ftp.user,
    password: options.ftp.password,
  });

  await client.start(options.ftp.targetDir);
  const localBaseDir = Path.resolve(options.local.targetDir);
  await uploadFiles(client, data, localBaseDir);
  client.end();
};
