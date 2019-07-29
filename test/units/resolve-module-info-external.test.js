const path = require('path');
const {
  isExternalModule,
  resolveModuleInfoExternal,
} = require('../../src/resolve-module-info-external');

describe('isExternalModule', () => {
  test('./module', () => {
    expect(isExternalModule('./module')).toBeFalsy();
  });

  test('/module', () => {
    expect(isExternalModule('/module')).toBeFalsy();
  });

  test('module', () => {
    expect(isExternalModule('module')).toBeTruthy();
  });

  test('@/module', () => {
    expect(isExternalModule('@/module')).toBeTruthy();
  });

  test('@module', () => {
    expect(isExternalModule('@module')).toBeTruthy();
  });

  test('@module/xxx', () => {
    expect(isExternalModule('@module/xxx')).toBeTruthy();
  });

  test('module/xxx', () => {
    expect(isExternalModule('module/xxx')).toBeTruthy();
  });
});


describe('resolveModuleInfoExternal', () => {
  test('resolve dependencies lodash', () => {
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = resolveModuleInfoExternal('lodash', root);
    expect(res).toEqual({
      requireName: 'lodash',
      moduleName: 'lodash',
      dependencyType: 'dependencies',
      version: '^4.17.14',
    });
  });

  test('resolve dependencies lodash/map', () => {
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = resolveModuleInfoExternal('lodash/map', root);
    expect(res).toEqual({
      requireName: 'lodash/map',
      moduleName: 'lodash',
      dependencyType: 'dependencies',
      version: '^4.17.14',
    });
  });

  test('resolve peerDependencies', () => {
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = resolveModuleInfoExternal('webpack', root);
    expect(res).toEqual({
      requireName: 'webpack',
      moduleName: 'webpack',
      dependencyType: 'peerDependencies',
      version: '5',
    });
  });

  test('resolve devDependencies', () => {
    const root = path.resolve(__dirname, '../fixtures/modules/');
    const res = resolveModuleInfoExternal('vuex', root);
    expect(res).toEqual({
      requireName: 'vuex',
      moduleName: 'vuex',
      dependencyType: 'devDependencies',
      version: 'latest',
    });
  });

  test('resolve devDependencies without pacakge.json', () => {
    const root = path.resolve(__dirname, '/a');
    const res = resolveModuleInfoExternal('cannot find', root);
    expect(res).toEqual({});
  });
});
