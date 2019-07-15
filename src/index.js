const path = require('path');
const { parseDependencyRecursive } = require('./dependency/parse-dependency-recursive');

(async function() {
  const entry = path.resolve(__dirname, '../test/fixtures/modules/recursive-module/1.js');
  const res = await parseDependencyRecursive(entry)
  console.log(res);
})();


