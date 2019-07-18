const path = require('path');
const { findPackageJsonPath } = require('../../src/find-package-json');

describe('findPackageJson', () => {
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
