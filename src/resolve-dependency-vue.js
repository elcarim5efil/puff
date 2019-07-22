const precinct = require('precinct');
const { parseComponent } = require('vue-template-compiler');
const { readFile } = require('./read-file');

function collectScriptDependenciesVue(script) {
  const { content } = script;
  const dependencyPaths = precinct(content, {
    es6: {
      mixedImports: true,
    },
  });
  return dependencyPaths;
}

function collectStylesDependenciesVue(styles) {
  return styles.reduce((res, style) => {
    const { content, lang } = style;
    const dependencyPaths = precinct(content, { type: lang });
    return res.concat(dependencyPaths);
  }, []);
}

function resolveDependencyVueByContent(content) {
  const descriptor = parseComponent(content);
  const { script, styles } = descriptor;
  const scriptDependencyPaths = collectScriptDependenciesVue(script);
  const styleDependencyPaths = collectStylesDependenciesVue(styles);
  const dependencyPaths = [].concat(scriptDependencyPaths).concat(styleDependencyPaths);
  return dependencyPaths;
}

async function resolveDependencyVue(filePath) {
  const content = await readFile(filePath);
  const dependencyPaths = resolveDependencyVueByContent(content);
  return {
    path: filePath,
    absolutePath: filePath,
    dependencyPaths,
  };
}

module.exports = {
  parseComponent,
  resolveDependencyVue,
  resolveDependencyVueByContent,
  collectScriptDependenciesVue,
  collectStylesDependenciesVue,
};
