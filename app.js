const morgan = require('morgan');
const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const getDomDate = require('./src/cheerio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (process.env.NODE_ENV) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('short'));
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

const grabbag = require('./src/models/GrabBag');
const active = require('./src/models/Active');
const bing = require('./src/models/bing');
const user = require('./src/models/user');
const attachment = require('./src/models/attachment');

getDomDate.start();
app.use('/api/grabbag', grabbag);
app.use('/api/active', active);
app.use('/api/bing', bing);
app.use('/api/user', user);
app.use('/api/attachment', attachment);
const port = 5166;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
