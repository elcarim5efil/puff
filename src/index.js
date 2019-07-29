const { parseDependencyRecursive } = require('./parse');
const { findCircle } = require('./find-circle');

module.exports = {
  parse: parseDependencyRecursive,
  parseDependencyRecursive,
  findCircle,
};
