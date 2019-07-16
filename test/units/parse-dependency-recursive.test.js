const path = require('path');
const { parseDependencyRecursive } = require('../../src/dependency/parse-dependency-recursive');

const cwd = process.cwd();
function resolvePath(...args) {
  return path.resolve(cwd, ...args);
}

describe('parseDependencyRecursive', () => {

  test('es module: import', async () => {
    const entryPath = resolvePath('test/fixtures/modules/import-a.js');
    const res = await parseDependencyRecursive(entryPath);
    const {
      flattenDependencyFilePaths,
      entry
    } = res;
    expect(flattenDependencyFilePaths).toHaveLength(2);
    expect(flattenDependencyFilePaths).toEqual([
      resolvePath('test/fixtures/modules/import-a.js'),
      resolvePath('test/fixtures/modules/a.js')
    ]);

    expect(entry.type).toBe('js');
    expect(entry.parent).toBeNull();
    expect(entry.parentFilePath).toBeNull();
    expect(entry.dependencyPaths).toHaveLength(1);
    expect(entry.dependencies).toHaveLength(1);
  });

  test('commonjs: require', async () => {
    const entryPath = resolvePath('test/fixtures/modules/require-a.js');
    const res = await parseDependencyRecursive(entryPath);
    const {
      flattenDependencyFilePaths,
      entry
    } = res;
    expect(flattenDependencyFilePaths).toHaveLength(2);
    expect(flattenDependencyFilePaths).toEqual([
      resolvePath('test/fixtures/modules/require-a.js'),
      resolvePath('test/fixtures/modules/a.js')
    ]);

    expect(entry.type).toBe('js');
    expect(entry.parent).toBeNull();
    expect(entry.parentFilePath).toBeNull();
    expect(entry.dependencyPaths).toHaveLength(1);
    expect(entry.dependencies).toHaveLength(1);
  });

  test('es module: import', async () => {
    const entryPath = resolvePath('test/fixtures/modules/import-a-and-b.js');
    const res = await parseDependencyRecursive(entryPath);
    const {
      maxDepth,
      flattenDependencyFilePaths,
      entry
    } = res;
    // console.log(flattenDependencyFilePaths);
    // console.log(entry);
    console.log(maxDepth);
    console.log(entry.dependencies);
    console.log(entry.dependencies[1]);
    // expect(flattenDependencyFilePaths).toHaveLength(2);
    // expect(flattenDependencyFilePaths).toEqual([
    //   resolvePath('test/fixtures/modules/import-a.js'),
    //   resolvePath('test/fixtures/modules/a.js')
    // ]);

    // expect(entry.type).toBe('js');
    // expect(entry.parent).toBeNull();
    // expect(entry.parentFilePath).toBeNull();
    // expect(entry.dependencyPaths).toHaveLength(1);
    // expect(entry.dependencies).toHaveLength(1);
  });
});