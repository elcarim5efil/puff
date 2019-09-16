const path = require('path');
const { parseDependencyRecursive } = require('../../src/parse');
const { findCircle } = require('../../src/find-circle');

const cwd = process.cwd();
function resolvePath(...args) {
  return path.resolve(cwd, ...args);
}

describe('find-circle', () => {
  test('without circle', async () => {
    const entryPath = resolvePath('test/fixtures/modules/import-a.js');
    const depInfo = await parseDependencyRecursive(entryPath);

    const res = findCircle(depInfo.entry);
    expect(res).toHaveLength(0);
  });

  test('with one circle', async () => {
    const entryPath = resolvePath('test/fixtures/modules/recursive-module/1.js');
    const depInfo = await parseDependencyRecursive(entryPath);

    const res = findCircle(depInfo.entry);
    expect(res).toHaveLength(1);
    expect(res[0]).toHaveLength(4);

    res[0].forEach((ele, index) => {
      if (index === 3) {
        expect(ele).toContain('1.js');
      } else {
        expect(ele).toContain(`${index + 1}.js`);
      }
    });
  });

  test('with multiple circles', async () => {
    const entryPath = resolvePath('test/fixtures/modules/recursive-module/4-1.js');
    const depInfo = await parseDependencyRecursive(entryPath);

    const res = findCircle(depInfo.entry);
    expect(res).toHaveLength(2);

    expect(res[0]).toHaveLength(3);
    expect(res[1]).toHaveLength(4);

    res[0].forEach((ele, index) => {
      if (index === 2) {
        expect(ele).toContain('4-1.js');
      } else {
        expect(ele).toContain(`4-${index + 1}.js`);
      }
    });

    res[1].forEach((ele, index) => {
      if (index === 3) {
        expect(ele).toContain('1.js');
      } else {
        expect(ele).toContain(`${index + 1}.js`);
      }
    });
  });
});
