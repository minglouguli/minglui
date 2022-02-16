//生成模块注册文件

const fs = require('fs');
const path = require('path');
const cmdTool = require('./cliTool');
const processPath = process.cwd();

const eleFiles = cmdTool.readAllFile(path.resolve(processPath, './src/pages'));
const comFiles = cmdTool.readAllFile(
  path.resolve(processPath, './src/components')
);

let content = '';
let arr = [];
let pageTree = [
  {
    text: 'ml-nav',
    value: 'ml-nav'
  }
];

for (let i = 0; i < eleFiles.length; i++) {
  const element = eleFiles[i];
  if (!comFiles.includes(element)) {
    arr.push('page_' + i);
    content += 'import page_' + i + " from '@/pages/" + element + "';\r";
    //system/systemSetting/system-config-edit.vue
    let pv = element.substring(0, element.indexOf('.'));
    let pvarr = pv.split('/');
    let current = pageTree;

    while (pvarr.length > 0) {
      let it = pvarr.shift();
      if (it) {
        let cit = current.find(f => f.value == it);
        if (!cit) {
          cit = {
            value: it,
            text: it
          };
          current.push(cit);
        }
        if (pvarr.length > 0) {
          if (!cit.nodes) {
            cit.nodes = [];
          }
          current = cit.nodes;
        }
      }
    }
  }
}

for (let i = 0; i < comFiles.length; i++) {
  const element = comFiles[i];

  arr.push('com_' + i);
  content += 'import com_' + i + " from '@/components/" + element + "';\r";
}
console.log(content);

content += 'export default [\r  ' + arr.join(',\r  ') + '\r];\r';

let targetDir = path.resolve(processPath, `./src/autoCode`);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

fs.writeFile(
  path.resolve(processPath, './src/autoCode/automComponents.js'),
  content,
  { flag: 'w', encoding: 'utf-8', mode: '0666' },
  function(err) {
    if (err) {
      console.log('文件写入失败');
    } else {
      console.log('文件写入成功');
    }
  }
);

//写入page信息；
if (pageTree.length > 1) {
  let pageInfoContent =
    `/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
export default ` + JSON.stringify(pageTree, null, '  ');

  fs.writeFile(
    path.resolve(processPath, `./src/autoCode/pageInfo.js`),
    pageInfoContent,
    { flag: 'w', encoding: 'utf-8', mode: '0666' },
    function(err) {
      if (err) {
        console.log('文件写入失败');
      } else {
        console.log('文件写入成功');
      }
    }
  );
}
