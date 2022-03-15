// 引入mongoose模块组件
const mongoose = require('mongoose');

// 定义地址
let uri = '';
if (process.env.NODE_ENV === 'remote') {
  uri = 'mongodb://47.105.113.47:7004/testdb';
} else {
  uri = 'mongodb://47.105.113.47:7004/testdb';
}

mongoose.Promise = global.Promise;

// 链接数据库
const db = () => {
  console.log('开始链接');
  mongoose.connect(uri, { useMongoClient: true }, err => {
    if (err) {
      console.log('错误啦');
      console.error(err);
      return;
    }
    console.log('connect success');
  });
};
module.exports = db;
