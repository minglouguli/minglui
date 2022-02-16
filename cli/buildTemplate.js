//node buildcom.js test  all  ../src/app/rili-app/components/test
const fs = require('fs');
const path = require('path');
const { read } = require('./cliTool');

console.log('--------------开始生产模板------------------');

async function main() {
  //var args = process.argv.splice(2);
  // var entity = args[0] || 'template';
  // var type = args[1] || 'notype';
  // var filePath = args[2] || '';
  // var group = args[3] || entity;

  let type = await read('请输入模板类型');
  let entity = await read('请输入页面名称');
  let group = await read('请输入页面所在集合', entity);
  let filePath = './../src/pages/' + group;

  if (!type || !entity || !group) {
    console.log('缺少输入');
    return;
  }

  var task = [];
  if (type == 'all') {
    task = ['list', 'add', 'edit'];
  } else {
    task = [type];
  }

  for (let i = 0; i < task.length; i++) {
    const element = task[i];
    build(element, group, entity, filePath);
  }
}

function build(tp, group, entity, filePath) {
  if (filePath) {
    var dir = path.resolve(__dirname, filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var fpath = dir + `\\${entity}-${tp}.vue`;
    if (fs.existsSync(fpath)) {
      console.log(`【${tp}】生成失败，目标文件已存在${fpath}`);
      return;
    }
    let template = '';
    try {
      var templateFun = require('./template/' + tp);
      var templateObj = templateFun({
        group: group,
        name: entity
      });
      template = templateObj.template;
    } catch (ex) {
      console.log(`未找到模板：${tp}`);
      return;
    }

    //console.log(':' + fpath);
    fs.writeFile(
      fpath,
      template,
      { flag: 'w', encoding: 'utf-8', mode: '0666' },
      function(err) {
        if (err) {
          console.log('文件写入失败', err);
        } else {
          console.log('文件写入成功----' + fpath);
        }
      }
    );
  } else {
    console.log('参数错误');
  }
}

main();
