const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const getDomDate = require('./src/cheerio');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json(
  {
    limit:2048000
  }
));
// 设置xml解析，用于邮箱服务
app.use(bodyParser.xml());

// 设置ejs 模板引擎
app.set('views',path.join(__dirname,'src/views'))
app.set('view engine','ejs')

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });
if (process.env.NODE_ENV) {
  app.use(morgan('dev', { stream: accessLogStream }));
} else {
  app.use(morgan('common', { stream: accessLogStream }));
}

// app.all('*', (req, res, next) => {
//   const { origin, Origin, referer, Referer } = req.headers;
//   const allowOrigin = origin || Origin || referer || Referer || '*';
//   res.header('Access-Control-Allow-Origin', allowOrigin);
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, X-Requested-With'
//   );
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Credentials', true); // 可以带cookies
//   res.header('X-Powered-By', 'Express');
//   if (req.method == 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

//视图
const views = require('./src/routes/views')

const grabbag = require('./src/routes/GrabBag');
const active = require('./src/routes/Active');
const Bing = require('./src/routes/bing');
const user = require('./src/routes/user');
const Typeset = require('./src/routes/Typeset');
const attachment = require('./src/routes/attachment');
const PdfToImage = require('./src/routes/pdftoimage/index');
const Website = require('./src/routes/website/index');
const Wechat = require('./src/routes/wechat/index.js');
const blurhash = require('./src/routes/blurhash/index');
const Log = require('./src/routes/log/index.js');
const Mailer = require('./src/routes/mailer/index.js');
// 爬虫
// getDomDate.start();
app.use('/api/grabbag', grabbag);
app.use('/api/active', active);
app.use('/api/bing', Bing);
app.use('/api/user', user);
app.use('/api/attachment', attachment);
app.use('/api/typeset', Typeset)
   .use('/api/pdftoimage',PdfToImage)
   .use('/api/wechat',Wechat)
   .use('/api/log',Log)
   .use('/api/website',Website)
   .use('/api/blurhash',blurhash)
   .use('/api/mailer',Mailer)
   .use('/',views)
   .use('/views',views)
const port = 5166;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
