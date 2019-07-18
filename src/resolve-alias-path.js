function resolveAliasPath(filePath, aliasMap = {}) {
  const prefix = filePath.split('/')[0];
  const endPrefix = `${prefix}$`;
  let res = '';
  if (aliasMap[prefix]) {
    res = filePath.replace(prefix, aliasMap[prefix]);
  } else if (aliasMap[endPrefix] && prefix === filePath) {
    res = aliasMap[endPrefix];
  } else {
    res = filePath;
  }
  return res;
}

module.exports = {
  resolveAliasPath,
};
