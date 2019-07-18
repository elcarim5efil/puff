const { resolveExternalModuleName } = require('../../src/resolve-external-module-name');

describe('createModule', () => {
  test('without scope name/module', () => {
    expect(resolveExternalModuleName('lodash')).toBe('lodash');
    expect(resolveExternalModuleName('lodash/map')).toBe('lodash');
    expect(resolveExternalModuleName('lodash.map')).toBe('lodash.map');
  });

  test('with scope @scope/name', () => {
    expect(resolveExternalModuleName('@scope/utils')).toBe('@scope/utils');
    expect(resolveExternalModuleName('@scope/utils/map')).toBe('@scope/utils');
    expect(resolveExternalModuleName('@scope/utils.map')).toBe('@scope/utils.map');
    expect(resolveExternalModuleName('@scope/common.utils/math/max')).toBe('@scope/common.utils');
  });

  test('with alias \'@\' @/path/to', () => {
    expect(resolveExternalModuleName('@/scope/utils')).toBe('@/scope/utils');
    expect(resolveExternalModuleName('@/scope/utils/map')).toBe('@/scope/utils/map');
  });

  test('not module', () => {
    expect(resolveExternalModuleName('/path/utils')).toBe('/path/utils');
    expect(resolveExternalModuleName('./path/utils/map')).toBe('./path/utils/map');
  });

  test('undefined or null', () => {
    expect(resolveExternalModuleName()).toBeUndefined();
    expect(resolveExternalModuleName(null)).toBeNull();
  });
});
