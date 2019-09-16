const {
  parse,
  parseDependencyRecursive,
  findCircle,
} = require('../../src/index');


describe('index', () => {
  test('should export functions', () => {
    expect(parse).toBe(parseDependencyRecursive);
    expect(typeof parse).toBe('function');
    expect(typeof findCircle).toBe('function');
  });
});
