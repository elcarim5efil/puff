function createModule({
  name,
  filePath,
  type,
  dependencyPaths = [],
  dependencies = [],
  external = false,
  depth = null,
}) {
  return {
    name,
    filePath,
    type,
    parent: null,
    parentFilePath: null,
    dependencyPaths,
    dependencies,
    depth,
    external,
  };
}

module.exports = {
  createModule,
};
