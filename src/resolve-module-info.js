const path = require('path');
const fs = require('fs');
const { parseDependencySingleFile } = require('./parse-dependency-single-file');
const { parseDependencyVue } = require('./parse-dependency-vue');
const { resolveModuleInfoExternal } = require('./resolve-module-info-external');

function isExternalModule(moduleName) {
  return !/^[\.|\/]/.test(moduleName);
}

function resolveModuleType(filePath) {
  const ext = path.extname(filePath);
  return ext.substr(1);
}

function resolveModuleFilePath(moduleName, root) {
  let filePath = moduleName;
  let fileMatched = false;
  if (root) {
    const rootDirname = path.dirname(root);
    filePath = path.resolve(rootDirname, moduleName);
  }

  // found dir or file
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    // ./path/to/module/
    if (stat.isDirectory()) {
      filePath = path.resolve(filePath, 'index');
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
      let tempFilePath = `${filePath}.${type}`;
      if (fs.existsSync(tempFilePath)) {
        filePath = tempFilePath;
        return true;
      }
    });
  }

  return filePath;
}

const moduleInfoCache = {};
async function resolveModuleInfo(moduleName, root) {
  const info = {
      name: moduleName,
      filePath: null,
      external: false,
      type: null,
  };

  if (isExternalModule(moduleName)) {
    const externalModuleInfo = resolveModuleInfoExternal(moduleName, root);
    Object.assign(info, { external: true }, externalModuleInfo);
  } else {
    const filePath = resolveModuleFilePath(moduleName, root);
    Object.assign(info, {
      type: resolveModuleType(filePath),
      filePath,
    });
  }

  if (info.filePath && !info.dependencyPaths) {
    const cachedModuleInfo = moduleInfoCache[info.filePath]
    if (cachedModuleInfo) {
      info.dependencyPaths = cachedModuleInfo.dependencyPaths;
    } else {
      if (info.type === 'vue') {
        const { dependencyPaths } = await parseDependencyVue(info.filePath);
        info.dependencyPaths = dependencyPaths;
      } else {
        const { dependencyPaths } = await parseDependencySingleFile(info.filePath);
        info.dependencyPaths = dependencyPaths;
      }
    }
  }

  return info;
}

module.exports = {
  resolveModuleInfo,
};
