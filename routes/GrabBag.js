const express = require('express')
const cheerioFunc = require('../src/cheerio');

const router = express.Router()

router.get('/getList', (req, res) => {
  cheerioFunc.start((ress) => {
    const data = {
      success: true,
      data: ress,
    }
    res.status(200).send(data);
  })
})
module.exports = router;
