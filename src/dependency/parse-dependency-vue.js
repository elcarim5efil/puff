const precinct = require('precinct');
const fs = require('fs-extra');
const { parseComponent } = require('vue-template-compiler');

function  collectScriptDependencies(script) {
  const { content, lang } = script;
  if (content) {
    const dependencyPaths = precinct(content, {
      es6: {
        mixedImports: true
      }
    });
    return dependencyPaths;
  }
}

function collectStylesDependencies(styles) {
  return styles.reduce((res, style) => {
    const { content, lang } = style;
    const dependencyPaths = precinct(content, { type: lang });
    return res.concat(dependencyPaths);
  }, []);
}

function parseDependencyVue(filePath) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, content) => {
      if (!err) {
        const discriptor = parseComponent(content);
        const { script, styles } = discriptor;
        const scriptDependencyPaths = collectScriptDependencies(script);
        const styleDependencyPaths = collectStylesDependencies(styles);
        const dependencyPaths = [].concat(scriptDependencyPaths).concat(styleDependencyPaths);

        const res = {
          path: filePath,
          absolutePath: filePath,
          dependencyPaths,
        };

        resolve(res);
      } else {
        reject(err);
      }
    })
  });
}

module.exports = {
  parseDependencyVue,
};
