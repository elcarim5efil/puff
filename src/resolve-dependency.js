const precinct = require('precinct');
const { readFile } = require('./read-file');

function resolveDependencyByContent(content) {
  const dependencyPaths = precinct(content, {
    es6: {
      mixedImports: true,
    },
  });
  return dependencyPaths;
}

async function resolveDependency(filePath) {
  const content = await readFile(filePath);
  const dependencyPaths = resolveDependencyByContent(content, filePath);
  return {
    path: filePath,
    absolutePath: filePath,
    dependencyPaths,
  };
}

module.exports = {
  resolveDependencyByContent,
  resolveDependency,
};
