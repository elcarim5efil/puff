<p align="center">
  <a href="https://codecov.io/gh/elcarim5efil/puff">
    <img src="https://img.shields.io/npm/v/puffs.svg?style=for-the-badge" />
  </a>

  <a href="https://travis-ci.org/elcarim5efil/puff">
    <img src="https://img.shields.io/travis/elcarim5efil/puff.svg?branch=master&style=for-the-badge">
  </a>

  <a href="https://codecov.io/gh/elcarim5efil/puff">
    <img src="https://img.shields.io/codecov/c/github/elcarim5efil/puff.svg?style=for-the-badge" />
  </a>
</p>

# puff

A package for ananysis file dependencies. Using [precinct](https://github.com/dependents/node-precinct) to do the file parsing jobs.

support:

- .js, .ts (as precinct does)
- .less, .sass
- .vue

## usage

```bash
npm i puffs
```

```javascript
import { resolve } form 'path';
import { parse } from 'puffs';

const result = await parse(path.resolve('/path/to/file.vue'));
```

## api

### prase

parse the file path and its file dependencies.

returns: 

- maxDepth, max dependencies depth
- flattenDependencyFilePaths, all file paths including the entry file itself
- entry, dependencies tree from the entry
- externals, externals node_module dependencies

