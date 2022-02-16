const fs = require('fs');
const path = require('path');
const readline = require('readline');

var readAllFile = function(dirPath) {
  var r = [];
  if (fs.existsSync(dirPath)) {
    let all = fs.readdirSync(dirPath);
    all.forEach(e => {
      let fpath = path.resolve(dirPath, e);
      let fileInfo = fs.statSync(fpath);
      if (fileInfo.isDirectory()) {
        let sps = readAllFile(fpath);
        sps.forEach(se => {
          r.push(e + '/' + se);
          // r.push(path.join(e, se));
        });
      } else {
        r.push(e);
      }
    });
  }

  return r;
};

exports.read = async function(info) {
  let input = '';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  //console.log('----------read---------');
  rl.write(info || '');
  rl.write('\r\n');
  await new Promise(r => {
    rl.on('line', line => {
      r(line);
    });
    // rl.question(info, answer => {
    //   r(answer);
    // });
  }).then(line => {
    input = line;
  });
  rl.close();
  return input;
};

exports.readAllFile = readAllFile;
