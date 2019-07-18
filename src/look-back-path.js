const path = require('path');

function lookBackPath(rootPath, callback) {
  let pathParts = rootPath.split(path.sep);
  if (pathParts[pathParts.length - 1] === '') {
    pathParts = pathParts.slice(0, pathParts.length - 1);
  }

  while (pathParts.length > 0) {
    let tempPath = pathParts.join(path.sep);
    if (pathParts.length === 1 && pathParts[0] === '') {
      tempPath = '/';
    }
    if (callback && callback(tempPath, pathParts)) {
      break;
    }
    pathParts = pathParts.slice(0, pathParts.length - 1);
  }
}

module.exports = {
  lookBackPath,
};
