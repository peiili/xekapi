const db = require('./connt');
const Article = require('./schema/ArtcalSchema.js');

db();

// 实例模型
const art = new Article({
  title: 'node.js',
  author: 'node',
  content: 'node.js is great',
  publishTime: new Date(),
});

// 将文档插入集合中
art.save(err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('save successed');
});
