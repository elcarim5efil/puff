const { lookBackPath } = require('../../src/look-back-path');

describe('lookBackPath', () => {
  test('/', () => {
    const rootPath = '/';
    const res = [];
    lookBackPath(rootPath, (p) => {
      res.push(p);
    });
    expect(res).toEqual([
      '/',
    ]);
  });

  test('./', () => {
    const rootPath = './';
    const res = [];
    lookBackPath(rootPath, (p) => {
      res.push(p);
    });
    expect(res).toEqual([
      '.',
    ]);
  });

  test('./a/b/c', () => {
    const rootPath = './a/b/c';
    const res = [];
    lookBackPath(rootPath, (p) => {
      res.push(p);
    });

    expect(res).toEqual([
      './a/b/c',
      './a/b',
      './a',
      '.',
    ]);
  });

  test('./a/b/c/', () => {
    const rootPath = './a/b/c/';
    const res = [];
    lookBackPath(rootPath, (p) => {
      res.push(p);
    });

    expect(res).toEqual([
      './a/b/c',
      './a/b',
      './a',
      '.',
    ]);
  });

  test('/a/b/c/', () => {
    const rootPath = '/a/b/c/';
    const res = [];
    lookBackPath(rootPath, (p) => {
      res.push(p);
    });

    expect(res).toEqual([
      '/a/b/c',
      '/a/b',
      '/a',
      '/',
    ]);
  });

  test('a/b/c/', () => {
    const rootPath = 'a/b/c/';
    const res = [];
    lookBackPath(rootPath, (p) => {
      res.push(p);
    });

    expect(res).toEqual([
      'a/b/c',
      'a/b',
      'a',
    ]);
  });
});
