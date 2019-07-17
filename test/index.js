const path = require('path');
const { parseDependencyVue } = require('../src/parse-dependency-vue');
const { parseDependencyRecursive } = require('../src/parse-dependency-recursive');
// const { findCircle } = require('./dependency/find-circle');

(async function() {
  // const entry = path.resolve(__dirname, '../test/fixtures/modules/import-a-and-b.js');
  // const entry = path.resolve(__dirname, '../test/fixtures/modules/recursive-module/1.js');
  // const res = await parseDependencyRecursive(entry)
  // const c = findCircle(res.entry);
  // console.log(c)

  // const entry = path.resolve(__dirname, '../test/fixtures/vue/index.vue');
  const entry = path.resolve(__dirname, './fixtures/vue/index.js');
  const res = await parseDependencyRecursive(entry);
  console.log(res);
})();


