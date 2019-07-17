function findCircleNoRecursive(root) {
  const pending = [];
  const stack = [];
  const visited = [];
  const res = [];
  let current;

  pending.push(root);

  while(pending.length) {
    let shouldbreak = false;
    current = pending.pop();
    if (stack[stack.length - 1] !== current.filePath) {
      stack.push(current.filePath);
    }
    visited.push(current.filePath);

    for(let i = current.dependencies.length - 1; i >= 0; --i) {
      const node = current.dependencies[i];
      const indexInStack = stack.indexOf(node.filePath);
      if (indexInStack > -1) {
        res.push(
          stack.slice(indexInStack)
            .concat(node.filePath)
        );
      }

      if (visited.indexOf(node.filePath) === -1) {
        if (pending.indexOf(current) === -1) {
          pending.push(current);
        }
        if (pending.indexOf(node) === -1) {
          shouldbreak = true;
          pending.push(node);
        }
      }
    }

    if (!shouldbreak) {
      stack.pop();
    }
  }

  console.log(visited);
  return res;
}

module.exports = {
  findCircleNoRecursive,
};
