const morgan = require('morgan')
const express = require('express')

const app = express()

app.use(morgan('dev'))

const grabbag = require('./routes/GrabBag')

app.use('/api', grabbag);

app.listen(5166, () => {
  console.log('App listening on port 5566!');
});
