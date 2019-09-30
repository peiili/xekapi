const morgan = require('morgan')
const express = require('express')
const process = require('process')
const bodyParser = require('body-parser');
const getDomDate = require('./src/cheerio');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
if (process.env.NODE_ENV) {
  app.use(morgan('dev'))
} else {
  app.use(morgan('short'))
}

const grabbag = require('./routes/GrabBag');
const active = require('./routes/Active');
const wechatInfo = require('./routes/WechatInfo');

getDomDate.start();
app.use('/api', grabbag);
app.use('/api/active', active);
app.use('/api/wechatInfo', wechatInfo);
const port = 5166
app.listen(port, () => {
  console.log(`App listening on port${port}`);
});
