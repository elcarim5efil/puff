const path = require('path');
const {
  parseComponent,
  collectStylesDependenciesVue,
  collectScriptDependenciesVue,
  resolveDependencyVue,
  resolveDependencyVueByContent,
} = require('../../src/resolve-dependency-vue');

describe('collectStylesDependenciesVue', () => {
  test('less', () => {
    const descriptor = parseComponent(
      '<style lang="less">@import \'./common.less\';</style>',
    );
    const res = collectStylesDependenciesVue(descriptor.styles);
    expect(res).toEqual([
      './common.less',
    ]);
  });
});

describe('collectScriptDependenciesVue', () => {
  test('vue content', () => {
    const descriptor = parseComponent(
      '<script>import \'lodash\';</script>',
    );
    const res = collectScriptDependenciesVue(descriptor.script);
    expect(res).toEqual([
      'lodash',
    ]);
  });
});

describe('resolveDependencySingleFileContent', () => {
  test('vue content', () => {
    const content = '<script>import \'lodash\';</script>';
    const res = resolveDependencyVueByContent(content);
    expect(res).toEqual([
      'lodash',
    ]);
  });
});

describe('resolveDependency', () => {
  test('vue file', async () => {
    const filePath = path.resolve(__dirname, '../fixtures/vue/index.vue');
    const res = await resolveDependencyVue(filePath);
    expect(res).toEqual({
      path: filePath,
      absolutePath: filePath,
      dependencyPaths: [
        'lodash',
        './log',
        './common.less',
      ],
    });
  });
});
