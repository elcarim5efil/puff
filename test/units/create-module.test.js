const { createModule } = require('../../src/create-module');

describe('createModule', () => {
  test('default', () => {
    const module = createModule({
      name: 'test',
      filePath: 'path/to',
      type: 'js',
    });

    expect(module).toEqual({
      name: 'test',
      filePath: 'path/to',
      type: 'js',
      parent: null,
      parentFilePath: null,
      dependencyPaths: [],
      dependencies: [],
      external: false,
      depth: null,
    });
  });

  test('full params', () => {
    const module = createModule({
      name: 'test',
      filePath: 'path/to',
      type: 'js',
      dependencyPaths: ['path/to'],
      dependencies: [{ x: 1 }],
      external: true,
      depth: 1,
    });

    expect(module).toEqual({
      name: 'test',
      filePath: 'path/to',
      type: 'js',
      parent: null,
      parentFilePath: null,
      dependencyPaths: ['path/to'],
      dependencies: [{ x: 1 }],
      external: true,
      depth: 1,
    });
  });
});
