const morgan = require('morgan')
const express = require('express')
const process = require('process')

const app = express()
if (process.env.NODE_ENV) {
  app.use(morgan('dev'))
} else {
  app.use(morgan('short'))
}

const grabbag = require('./routes/GrabBag')

app.use('/api', grabbag);
const port = 5166
app.listen(port, () => {
  console.log(`App listening on port${port}`);
});
