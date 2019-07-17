function findCircle(root, stack = [], visited = [], res = []) {
  visited.push(root.filePath);
  stack.push(root.filePath);
  root.dependencies.forEach((node) => {
    const indexInStack = stack.indexOf(node.filePath);
    if (indexInStack > -1) {
      res.push(
        stack.slice(indexInStack)
          .concat(node.filePath)
      );
    }
    if (visited.indexOf(node.filePath) === -1) {
      findCircle(node, stack, visited, res);
    }
  });

  stack.pop();
  return res;
}

module.exports = {
  findCircle,
};
