const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const process = require('process');
const db = require('./src/database/connection');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:2048000}));
// 设置xml解析，用于邮箱服务
app.use(bodyParser.xml());

if(!fs.existsSync(path.join(__dirname, '/logs/'))) {
  fs.mkdirSync(path.join(__dirname, '/logs/'))
}
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });
if (process.env.NODE_ENV) {
  app.use(morgan('dev', { stream: accessLogStream }));
} else {
  app.use(morgan('common', { stream: accessLogStream }));
}
process.env._root = __dirname

app.all('*', (req, res, next) => {
  req.db = db
  next()
});

const article = require('./src/routes/article');
const Bing = require('./src/routes/bing');
const user = require('./src/routes/user');
const attachment = require('./src/routes/attachment');
const Website = require('./src/routes/website/index');
const Wechat = require('./src/routes/wechat/index.js');
const Log = require('./src/routes/log/index.js');
const Mailer = require('./src/routes/mailer/index.js');
// 爬虫
// getDomDate.start();
app.use('/api/article', article)
   .use('/api/bing', Bing)
   .use('/api/user', user)
   .use('/api/attachment', attachment)
   .use('/api/wechat',Wechat)
   .use('/api/log',Log)
   .use('/api/website',Website)
   .use('/api/mailer',Mailer)
const port = 5166;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
