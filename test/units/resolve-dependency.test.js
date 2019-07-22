const path = require('path');
const {
  resolveDependency,
  resolveDependencyByContent,
} = require('../../src/resolve-dependency');

describe('resolveDependencyByContent', () => {
  test('js content', () => {
    const content = 'import \'lodash\';';
    const res = resolveDependencyByContent(content);
    expect(res).toEqual([
      'lodash',
    ]);
  });
});

describe('resolveDependency', () => {
  test('js file', async () => {
    const filePath = path.resolve(__dirname, '../fixtures/modules/import-a.js');
    const res = await resolveDependency(filePath);
    expect(res).toEqual({
      path: filePath,
      absolutePath: filePath,
      dependencyPaths: [
        './a',
      ],
    });
  });
});
