const { createModule } = require('./create-module');
const { resolveModuleInfo } = require('./resolve-module-info');

async function parseDependencyRecursive(modulePath, options = {}) {
  const moduleQueque = [];
  const moduleCache = {};
  const flattenDependencyFilePaths = [];
  const externals = [];
  let maxDepth = 0;

  const moduleInfo = await resolveModuleInfo(modulePath, null, options);
  const entryModule = createModule(Object.assign({
    depth: 0,
  }, moduleInfo));

  moduleQueque.push(entryModule);

  while (moduleQueque.length > 0) {
    const currentModule = moduleQueque.shift();

    // add flatten dependency path
    flattenDependencyFilePaths.push(currentModule.filePath);

    // process dependencies
    for (let i = 0; i < currentModule.dependencyPaths.length; i += 1) {
      const dependencyPath = currentModule.dependencyPaths[i];
      const dependencyModuleInfo = await resolveModuleInfo(dependencyPath, currentModule.filePath, options);
      let dependencyModule;
      if (moduleCache[dependencyModuleInfo.filePath]) {
        dependencyModule = Object.assign({}, moduleCache[dependencyModuleInfo.filePath]);
      } else {
        dependencyModule = createModule(dependencyModuleInfo);

        // parse dependencies' dependencies
        if (!dependencyModuleInfo.external) {
          moduleQueque.push(dependencyModule);
        } else {
          externals.push(dependencyModuleInfo);
        }
      }

      dependencyModule.parent = currentModule;
      dependencyModule.depth = currentModule.depth + 1;
      maxDepth = Math.max(maxDepth, dependencyModule.depth);
      currentModule.dependencies.push(dependencyModule);
    }

    // add cache
    moduleCache[currentModule.filePath] = Object.assign({}, currentModule);
  }

  return {
    maxDepth,
    flattenDependencyFilePaths,
    entry: entryModule,
    externals,
  };
}

module.exports = {
  parseDependencyRecursive,
};
