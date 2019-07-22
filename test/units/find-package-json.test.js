const path = require('path');
const {
  findPackageJsonPath,
  findPackageJson,
} = require('../../src/find-package-json');

describe('findPackageJsonPath', () => {
  test('find package.json in dir', () => {
    const actualPath = path.resolve(__dirname, '../fixtures/modules/package.json');
    const root = path.resolve(__dirname, '../fixtures/modules/dir-module/index.js');
    const res = findPackageJsonPath(root);
    expect(res).toBe(actualPath);
  });

  test('find package.json in package.json root', () => {
    const actualPath = path.resolve(__dirname, '../fixtures/modules/package.json');
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = findPackageJsonPath(root);
    expect(res).toBe(actualPath);
  });

  test('cannot find package.json in /', () => {
    const root = '/';
    const res = findPackageJsonPath(root);
    expect(res).toBeNull();
  });
});

describe('findPackageJson', () => {
  test('find package.json in dir', () => {
    const root = path.resolve(__dirname, '../fixtures/modules/dir-module/index.js');
    const res = findPackageJson(root);
    expect(res.version).toBe('0.0.1');
    expect(res.name).toBe('puff.test.modules.package.json');
  });

  test('find package.json in package.json root', () => {
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = findPackageJson(root);
    expect(res.version).toBe('0.0.1');
    expect(res.name).toBe('puff.test.modules.package.json');
  });

  test('cannot find package.json in /', () => {
    const root = '/';
    const res = findPackageJsonPath(root);
    expect(res).toBeNull();
  });
});
