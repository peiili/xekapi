const express = require('express')
const cheerioFunc = require('../src/cheerio');

const router = express.Router()

router.get('/getList', (req, res) => {
  cheerioFunc.start((ress) => {
    res.send(ress);
  })
})
module.exports = router;
