const path = require('path');
const {
  resolveModuleFileType,
  resolveModuleFilePath,
  resolveModuleInfo,
} = require('../../src/resolve-module-info');

describe('resolveModuleFileType', () => {
  test('resolve js or vue', () => {
    expect(resolveModuleFileType('path/to/index.test.js')).toBe('js');
    expect(resolveModuleFileType('path/to/index.vue')).toBe('vue');
  });

  test('resolve none extension name', () => {
    expect(resolveModuleFileType('path/to')).toBe('');
  });

  test('resolve undefined', () => {
    expect(resolveModuleFileType()).toBe('');
  });
});

describe('resolveModuleFilePath', () => {
  test('require(\'./file.js\')', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules');
    const res = await resolveModuleFilePath('./a.js', root);
    expect(res).toEqual(path.resolve(__dirname, '../fixtures/modules/a.js'));
  });

  // require('./file.js');
  test('require(\'./file.js\')', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/b.js');
    const res = await resolveModuleFilePath('./a.js', root);
    expect(res).toEqual(path.resolve(__dirname, '../fixtures/modules/a.js'));
  });

  // require('./file');
  test('require(\'./file\')', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/b.js');
    const res = await resolveModuleFilePath('./a', root);
    expect(res).toEqual(path.resolve(__dirname, '../fixtures/modules/a.js'));
  });

  // require('./dir');
  test('require(\'./dir\')', async () => {
    const root = path.resolve(__dirname, '../fixtures/');
    const res = await resolveModuleFilePath('./modules/dir-module', root);
    expect(res).toEqual(path.resolve(__dirname, '../fixtures/modules/dir-module/index.js'));
  });

  // require('/path/to/dir');
  test('require(\'/path/to/dir\')', async () => {
    const res = await resolveModuleFilePath(path.resolve(__dirname, '../fixtures/modules/a'));
    expect(res).toEqual(path.resolve(__dirname, '../fixtures/modules/a.js'));
  });

  // resolve .vue extension
  test('resolve .vue extension', async () => {
    const root = path.resolve(__dirname, '../fixtures/vue');
    const res = await resolveModuleFilePath('./components/a', root);
    expect(res).toBe(
      path.resolve(__dirname, '../fixtures/vue/components/a/index.vue'),
    );
  });

  // root not exists
  test('throw error when not exists root', async () => {
    const root = path.resolve(__dirname, '../not-found/');
    try {
      await resolveModuleFilePath('../a', root);
    } catch (err) {
      expect(err).toEqual(new Error(`module root not exists: ${root}`));
    }
  });

  // require('moduleName'); with root
  test('require(\'moduleName\') with root', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/b.js');
    const res = await resolveModuleFilePath('a', root);
    expect(res).toEqual('a');
  });
});

describe('resolveModuleInfo', () => {
  test('a.js', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules');
    const res = await resolveModuleInfo('./a.js', root);
    expect(res).toEqual({
      name: './a.js',
      external: false,
      filePath: path.resolve(__dirname, '../fixtures/modules/a.js'),
      type: 'js',
      dependencyPaths: [],
    });
  });

  test('import-a.js', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules');
    const res = await resolveModuleInfo('./import-a.js', root);
    expect(res).toEqual({
      name: './import-a.js',
      external: false,
      filePath: path.resolve(__dirname, '../fixtures/modules/import-a.js'),
      type: 'js',
      dependencyPaths: [
        './a',
      ],
    });

    // using cache
    const cacheRes = await resolveModuleInfo('./import-a.js', root);
    expect(cacheRes).toEqual({
      name: './import-a.js',
      external: false,
      filePath: path.resolve(__dirname, '../fixtures/modules/import-a.js'),
      type: 'js',
      dependencyPaths: [
        './a',
      ],
    });
  });

  test('index.vue', async () => {
    const root = path.resolve(__dirname, '../fixtures/vue/');
    const res = await resolveModuleInfo('./index.vue', root);
    expect(res).toEqual({
      name: './index.vue',
      external: false,
      filePath: path.resolve(__dirname, '../fixtures/vue/index.vue'),
      type: 'vue',
      dependencyPaths: [
        'lodash',
        './log',
        './common.less',
      ],
    });
  });

  test('resolve third part node module (lodash)', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = await resolveModuleInfo('lodash', root);
    expect(res).toEqual({
      name: 'lodash',
      requireName: 'lodash',
      moduleName: 'lodash',
      dependencyType: 'dependencies',
      version: '^4.17.14',
      external: true,
      filePath: null,
      type: null,
    });
  });
});
