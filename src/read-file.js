const fs = require('fs');

function readFile(filePath, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding }, (err, content) => {
      if (!err) {
        resolve(content);
      } else {
        reject(err);
      }
    });
  });
}

module.exports = {
  readFile,
};
