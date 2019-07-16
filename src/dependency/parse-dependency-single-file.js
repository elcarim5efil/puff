const precinct = require('precinct');
const fs = require('fs-extra');

function parseDependencySingleFile(filePath) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, content) => {
      if (!err) {
        const dependencyPaths = precinct(content, {
          es6: {
            mixedImports: true
          }
        });
        const res = {
          path: filePath,
          absolutePath: filePath,
          dependencyPaths,
        };
        resolve(res);
      } else {
        reject(err);
      }
    })
  });
}

module.exports = {
  parseDependencySingleFile,
};
