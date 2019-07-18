const path = require('path');
const fs = require('fs');
const { lookBackPath } = require('./look-back-path');

function findPackageJsonPath(rootPath) {
  let res = null;
  lookBackPath(rootPath, (p) => {
    const tempPath = path.resolve(p, 'package.json');
    if (fs.existsSync(tempPath)) {
      res = tempPath;
      return true;
    }
    return false;
  });
  return res;
}

const packageJsonCache = {};
function findPackageJson(rootPath) {
  const packageJsonPath = findPackageJsonPath(rootPath);
  let content;
  if (packageJsonPath) {
    if (packageJsonCache[packageJsonPath]) {
      return packageJsonCache[packageJsonPath];
    }
    content = fs.readFileSync(packageJsonPath, 'utf8');
    const json = JSON.parse(content);
    packageJsonCache[packageJsonPath] = json;
    return json;
  }
  return null;
}

module.exports = {
  findPackageJsonPath,
  findPackageJson,
};
