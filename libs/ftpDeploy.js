const path = require('path');
const fs = require('fs-extra');
const uploadFiles = require('./uploadFiles');

const readDirRecursive = (directory) => {
  const items = [];
  const results = fs.readdirSync(directory);
  results.forEach((result) => {
    const itemPath = path.resolve(directory, result);
    const data = {};
    data.name = path.resolve(directory, result);
    if (fs.statSync(itemPath).isDirectory()) {
      data.type = 'directory';
      data.items = readDirRecursive(itemPath);
    } else {
      data.type = 'file';
    }
    items.push(data);
  });

  return items;
};

module.exports = async (options) => {
  const data = readDirRecursive(options.local.targetDir);
  uploadFiles(data, options);
};
