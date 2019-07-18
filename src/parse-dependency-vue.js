const precinct = require('precinct');
const { parseComponent } = require('vue-template-compiler');
const { readFile } = require('./read-file');

function collectScriptDependencies(script) {
  const { content } = script;
  const dependencyPaths = precinct(content, {
    es6: {
      mixedImports: true,
    },
  });
  return dependencyPaths;
}

function collectStylesDependencies(styles) {
  return styles.reduce((res, style) => {
    const { content, lang } = style;
    const dependencyPaths = precinct(content, { type: lang });
    return res.concat(dependencyPaths);
  }, []);
}

function parseDependencyVueContent(content) {
  const discriptor = parseComponent(content);
  const { script, styles } = discriptor;
  const scriptDependencyPaths = collectScriptDependencies(script);
  const styleDependencyPaths = collectStylesDependencies(styles);
  const dependencyPaths = [].concat(scriptDependencyPaths).concat(styleDependencyPaths);
  return dependencyPaths;
}

async function parseDependencyVue(filePath) {
  const content = await readFile(filePath);
  const dependencyPaths = parseDependencyVueContent(content);
  return {
    path: filePath,
    absolutePath: filePath,
    dependencyPaths,
  };
}

module.exports = {
  parseDependencyVue,
  parseDependencyVueContent,
  collectScriptDependencies,
  collectStylesDependencies,
};
