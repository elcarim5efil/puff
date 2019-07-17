const path = require('path');
const fs = require('fs');

function resolveExternalModuleName(requireName) {
  // '@scope/name'
  if (/^@[^/]/.test(requireName)) {
    return requireName.split('/').slice(0, 2).join('/');
  // 'name/xxx'
  } if (/^@\//.test(requireName)) {
    return requireName.split('/')[0];
  // alias '@/name'
  }
  return requireName;
}

function findPackageJsonPath(rootPath) {
  let pathParts = rootPath.split(path.sep);
  while (pathParts.length > 0) {
    const tempPath = path.resolve(pathParts.join(path.sep), 'package.json');
    if (fs.existsSync(tempPath)) {
      return tempPath;
    }
    pathParts = pathParts.slice(0, pathParts.length - 1);
  }
  return null;
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

function resolveModuleInfoExternal(requireName, rootPath) {
  const moduleName = resolveExternalModuleName(requireName);
  const packageJson = findPackageJson(rootPath) || {};
  const {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
  } = packageJson;
  const deps = {
    dependencies,
    devDependencies,
    peerDependencies,
  };
  const res = {};

  Object.keys(deps).some((dependencyType) => {
    const dep = deps[dependencyType];
    if (dep[moduleName]) {
      Object.assign(res, {
        requireName,
        moduleName,
        dependencyType,
        version: dep[moduleName],
      });
      return true;
    }
    return false;
  });

  return res;
}

module.exports = {
  resolveModuleInfoExternal,
  resolveExternalModuleName,
};
