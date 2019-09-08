const morgan = require('morgan')
const express = require('express')

const app = express()

app.use(morgan('dev'))

const grabbag = require('./routes/GrabBag')

app.use('/api', grabbag);
const port = 5166
app.listen(port, () => {
  console.log(`App listening on port${port}`);
});
