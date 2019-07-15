const fs = require('fs');
const path = require('path');
const { parseDependencySingleFile } = require('./parse-dependency-single-file');
const { resolveModuleInfo } = require('./resolve-module-info');

async function parseDependencyRecursive(modulePath) {
  const moduleQueque = [];
  const moduleCache = {};
  const flattenDependencyFilePaths = [];
  const moduleInfo = await resolveModuleInfo(modulePath);
  const entryModule = createModule({
    name: moduleInfo.moduleName,
    filePath: moduleInfo.absolutePath,
    type: moduleInfo.type,
    dependencyPaths: moduleInfo.dependencyPaths
  })
  moduleQueque.push(entryModule);

  while(moduleQueque.length > 0) {
    const currentModule = moduleQueque.shift();
    let currentModuleDependencyInfo;

    // add cache
    moduleCache[currentModule.filePath] = currentModule;

    // add flatten dependency path
    flattenDependencyFilePaths.push(currentModule.filePath);

    for (let i = 0; i < currentModule.dependencyPaths.length; ++i) {
      const dependencyPath = currentModule.dependencyPaths[i];
      const moduleInfo = await resolveModuleInfo(dependencyPath, currentModule.filePath);
      let dependencyModule;
      if (moduleCache[moduleInfo.absolutePath]) {
        dependencyModule = moduleCache[moduleInfo.absolutePath];
      } else {
        dependencyModule = createModule({
          name: moduleInfo.moduleName,
          filePath: moduleInfo.absolutePath,
          external: moduleInfo.external,
          type: moduleInfo.type,
          dependencyPaths: moduleInfo.dependencyPaths,
          parent: currentModule,
        });

        // parse dependencies' dependencies
        if (!moduleInfo.external) {
          moduleQueque.push(dependencyModule);
        }
      }

      currentModule.dependencies.push(dependencyModule);
    }
  }

  return {
    flattenDependencyFilePaths,
    entry: entryModule,
  };
}

function createModule({
  name,
  filePath,
  type,
  parent,
  dependencyPaths = []
}) {
  const parentFilePath = parent && parent.filePath || null;
  return {
    name,
    filePath,
    type,
    parent: null,
    parentFilePath,
    dependencyPaths,
    dependencies: [],
  };
}

module.exports = {
  parseDependencyRecursive,
};
