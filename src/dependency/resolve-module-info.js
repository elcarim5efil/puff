const path = require('path');
const fs = require('fs');
const { parseDependencySingleFile } = require('./parse-dependency-single-file');


function isExternalModule(moduleName) {
  return !/^[\.|\/]/.test(moduleName);
}

function resolveModuleType(filePath) {
  const ext = path.extname(filePath);
  return ext.substr(1);
}

function resolveModuleFilePath(moduleName, root) {
  let absolutePath = moduleName;
  let fileMatched = false;
  if (root) {
    const rootDirname = path.dirname(root);
    absolutePath = path.resolve(rootDirname, moduleName);
  }

  // found dir or file
  if (fs.existsSync(absolutePath)) {
    const stat = fs.statSync(absolutePath);
    // ./path/to/module/
    if (stat.isDirectory()) {
      absolutePath = path.resolve(absolutePath, 'index');
    // ./path/to/module/index[.ext]
    } else {
      fileMatched = true;
    }
  } 

  // ./path/to/module/index[.ext]
  // ./path/to/module[.ext]
  if (!fileMatched) {
    const tryType = [ 'js', 'vue' ];
    tryType.some((type) => {
      let tempAbsolutePath = `${absolutePath}.${type}`;
      if (fs.existsSync(tempAbsolutePath)) {
        absolutePath = tempAbsolutePath;
        return true;
      }
    });
  }

  return absolutePath;
}

const moduleInfoCache = {};
async function resolveModuleInfo(moduleName, root) {
  const info = {
      moduleName,
      absolutePath: null,
      external: false,
      type: null,
  };

  if (isExternalModule(moduleName)) {
    Object.assign(info, { external: true });
  } else {
    const absolutePath = resolveModuleFilePath(moduleName, root);
    Object.assign(info, {
      type: resolveModuleType(absolutePath),
      absolutePath: absolutePath,
    });
  }

  if (info.absolutePath && !info.dependencyPaths) {
    const cachedModuleInfo = moduleInfoCache[info.absolutePath]
    if (cachedModuleInfo) {
      info.dependencyPaths = cachedModuleInfo.dependencyPaths;
    } else {
      const { dependencyPaths } = await parseDependencySingleFile(info.absolutePath);
      info.dependencyPaths = dependencyPaths;
    }
  }

  return info;
}

module.exports = {
  resolveModuleInfo,
};
