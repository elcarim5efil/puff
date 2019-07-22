const path = require('path');
const { readFile } = require('../../src/read-file');

describe('', () => {
  test('read file successed', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/dir-module/index.js');
    const res = await readFile(root);
    expect(res).toBeDefined();
  });

  test('read file successed', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/dir-module/index.js');
    const res = await readFile(root, 'utf8');
    expect(res).toBeDefined();
  });

  test('read file failed', async () => {
    const root = path.resolve(__dirname, '../fixtures/modules/dir-module/not-found.js');
    try {
      await readFile(root);
    } catch (err) {
      expect(err.errno).toBe(-2);
    }
  });
});
