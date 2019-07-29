const path = require('path');
const fs = require('fs');
const { resolveDependency } = require('./resolve-dependency');
const { resolveDependencyVue } = require('./resolve-dependency-vue');
const { resolveAliasPath } = require('./resolve-alias-path');
const {
  isExternalModule,
  resolveModuleInfoExternal,
} = require('./resolve-module-info-external');

function resolveModuleFileType(filePath) {
  const ext = path.extname(filePath || '');
  return ext.substr(1);
}

function resolveModuleFilePath(moduleName, root) {
  let filePath = moduleName;
  let fileMatched = false;
  if (root) {
    if (!fs.existsSync(root)) {
      throw new Error(`module root not exists: ${root}`);
    }
    const rootStat = fs.statSync(root);
    if (rootStat.isDirectory()) {
      filePath = path.resolve(root, moduleName);
    } else {
      const rootDirname = path.dirname(root);
      filePath = path.resolve(rootDirname, moduleName);
    }
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
    const tryType = ['js', 'vue'];
    tryType.some((type) => {
      const tempFilePath = `${filePath}.${type}`;
      if (fs.existsSync(tempFilePath)) {
        filePath = tempFilePath;
        return true;
      }
      return false;
    });
  }

  return filePath;
}

const moduleInfoDependencyPathsCache = {};
async function resolveModuleInfo(requireName, root, options = {}) {
  const moduleName = resolveAliasPath(requireName, options.alias);
  const info = {
    name: requireName,
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
      type: resolveModuleFileType(filePath),
      filePath,
    });
  }

  if (!info.external && info.filePath && !info.dependencyPaths) {
    const cachedModuleInfoDependencyPaths = moduleInfoDependencyPathsCache[info.filePath];
    if (cachedModuleInfoDependencyPaths) {
      info.dependencyPaths = cachedModuleInfoDependencyPaths;
    } else if (info.type === 'vue') {
      const { dependencyPaths } = await resolveDependencyVue(info.filePath);
      info.dependencyPaths = dependencyPaths;
    } else {
      const { dependencyPaths } = await resolveDependency(info.filePath);
      info.dependencyPaths = dependencyPaths;
    }
    moduleInfoDependencyPathsCache[info.filePath] = info.dependencyPaths;
  }

  return info;
}

module.exports = {
  resolveModuleFileType,
  resolveModuleFilePath,
  resolveModuleInfo,
};
