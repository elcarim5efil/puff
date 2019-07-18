const { findPackageJson } = require('./find-package-json');
const { resolveExternalModuleName } = require('./resolve-external-module-name');

function isExternalModule(moduleName) {
  return !/^[.|/]/.test(moduleName);
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
  isExternalModule,
  resolveModuleInfoExternal,
  resolveExternalModuleName,
};
