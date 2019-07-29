const path = require('path');
const { parseDependencyRecursive } = require('../../src/parse');

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
      entry,
    } = res;
    expect(flattenDependencyFilePaths).toHaveLength(2);
    expect(flattenDependencyFilePaths).toEqual([
      resolvePath('test/fixtures/modules/import-a.js'),
      resolvePath('test/fixtures/modules/a.js'),
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
      entry,
    } = res;
    expect(flattenDependencyFilePaths).toHaveLength(2);
    expect(flattenDependencyFilePaths).toEqual([
      resolvePath('test/fixtures/modules/require-a.js'),
      resolvePath('test/fixtures/modules/a.js'),
    ]);

    expect(entry.type).toBe('js');
    expect(entry.parent).toBeNull();
    expect(entry.parentFilePath).toBeNull();
    expect(entry.dependencyPaths).toHaveLength(1);
    expect(entry.dependencies).toHaveLength(1);
  });

  test('depth', async () => {
    const entryPath = resolvePath('test/fixtures/modules/import-a-and-b.js');
    const res = await parseDependencyRecursive(entryPath);
    const {
      maxDepth,
      entry,
    } = res;

    expect(maxDepth).toBe(2);
    expect(entry.depth).toBe(0);
    expect(entry.dependencies[0].depth).toBe(1);
    expect(entry.dependencies[1].depth).toBe(1);
    expect(entry.dependencies[1].dependencies[0].depth).toBe(2);
  });

  test('alias', async () => {
    const entryPath = resolvePath('test/fixtures/modules/alias/index.js');
    const res = await parseDependencyRecursive(entryPath, {
      alias: {
        '@': resolvePath('test/fixtures/modules/alias/src/'),
      },
    });

    const {
      flattenDependencyFilePaths,
    } = res;

    expect(flattenDependencyFilePaths).toEqual([
      resolvePath('test/fixtures/modules/alias/index.js'),
      resolvePath('test/fixtures/modules/alias/src/a.js'),
      resolvePath('test/fixtures/modules/alias/src/b.js'),
    ]);
  });

  test('externals', async () => {
    const entryPath = resolvePath('test/fixtures/modules/externals/index.js');
    const res = await parseDependencyRecursive(entryPath);

    const {
      externals,
    } = res;

    expect(externals).toEqual([
      {
        name: 'lodash',
        filePath: null,
        external: true,
        type: null,
        requireName: 'lodash',
        moduleName: 'lodash',
        dependencyType: 'dependencies',
        version: '^4.17.14',
      },
    ]);
  });

  // test('circle\'s depth', async () => {
  //   const entryPath = resolvePath('test/fixtures/modules/recursive-module/1.js');
  //   const res = await parseDependencyRecursive(entryPath);
  //   const {
  //     maxDepth,
  //     flattenDependencyFilePaths,
  //     entry
  //   } = res;

  //   expect(maxDepth).toBe(4);
  //   expect(entry.depth).toBe(0);
  //   expect(entry.dependencies[0].depth).toBe(1);
  //   expect(entry.dependencies[0].dependencies[0].depth).toBe(2);
  // });
});
