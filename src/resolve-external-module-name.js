function resolveExternalModuleName(requireName) {
  if (typeof requireName !== 'string') {
    return requireName;
  }
  // '@scope/name'
  if (/^@[^/]/.test(requireName)) {
    return requireName.split('/').slice(0, 2).join('/');
  // 'name/xxx'
  } if (/^[^@|/|.]/.test(requireName)) {
    return requireName.split('/')[0];
  // alias '@/name'
  }
  return requireName;
}

module.exports = {
  resolveExternalModuleName,
};
