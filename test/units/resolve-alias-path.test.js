const { resolveAliasPath } = require('../../src/resolve-alias-path');

describe('resolveAliasPath', () => {
  test('{}', () => {
    const alias = {};
    expect(resolveAliasPath('xyz', alias)).toBe('xyz');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/file.js');
  });

  // xyz
  test('{ xyz: \'/abs/path/to/file.js\' }', () => {
    const alias = {
      xyz: '/abs/path/to/file.js',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('/abs/path/to/file.js');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('/abs/path/to/file.js/file.js');
  });

  test('{ xyz: \'./dir/file.js\' }', () => {
    const alias = {
      xyz: './dir/file.js',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('./dir/file.js');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('./dir/file.js/file.js');
  });

  test('{ xyz: \'/some/dir\' }', () => {
    const alias = {
      xyz: '/some/dir',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('/some/dir');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('/some/dir/file.js');
  });

  test('{ xyz: \'/modu/some/file.js\' }', () => {
    const alias = {
      xyz: '/modu/some/file.js',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('/modu/some/file.js');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('/modu/some/file.js/file.js');
  });

  test('{ xyz: \'/modu/dir\' }', () => {
    const alias = {
      xyz: '/modu/dir',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('/modu/dir');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('/modu/dir/file.js');
  });

  test('{ xyz: \'xyz/dir\' }', () => {
    const alias = {
      xyz: 'xyz/dir',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('xyz/dir');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/dir/file.js');
  });

  test('{ xyz: \'./dir\' }', () => {
    const alias = {
      xyz: './dir',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('./dir');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('./dir/file.js');
  });

  test('{ xyz: \'modu\' }', () => {
    const alias = {
      xyz: 'modu',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('modu');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('modu/file.js');
  });

  // xyz$
  test('{ xyz$: \'/abs/path/to/file.js\' }', () => {
    const alias = {
      xyz$: '/abs/path/to/file.js',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('/abs/path/to/file.js');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/file.js');
  });

  test('{ xyz$: \'./dir/file.js\' }', () => {
    const alias = {
      xyz$: './dir/file.js',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('./dir/file.js');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/file.js');
  });

  test('{ xyz$: \'/some/dir\' }', () => {
    const alias = {
      xyz$: '/some/dir',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('/some/dir');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/file.js');
  });

  test('{ xyz$: \'modu\' }', () => {
    const alias = {
      xyz$: 'modu',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('modu');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/file.js');
  });

  test('{ xyz$: \'xyz/dir\' }', () => {
    const alias = {
      xyz$: 'xyz/dir',
    };
    expect(resolveAliasPath('xyz', alias)).toBe('xyz/dir');
    expect(resolveAliasPath('xyz/file.js', alias)).toBe('xyz/file.js');
  });
});
