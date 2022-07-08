const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const getDomDate = require('./src/cheerio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json(
  {
    limit:2048000
  }
));
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

const grabbag = require('./src/routes/GrabBag');
const active = require('./src/routes/Active');
const Bing = require('./src/routes/bing');
const user = require('./src/routes/user');
const Typeset = require('./src/routes/Typeset');
const attachment = require('./src/routes/attachment');
const PdfToImage = require('./src/routes/PdfToImage/index');
// 爬虫
// getDomDate.start();
app.use('/api/grabbag', grabbag);
app.use('/api/active', active);
app.use('/api/bing', Bing);
app.use('/api/user', user);
app.use('/api/attachment', attachment);
app.use('/api/typeset', Typeset)
   .use('/api/pdftoimage',PdfToImage);
const port = 5166;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
