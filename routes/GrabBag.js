const express = require('express')
const cheerioFunc = require('../src/cheerio');
const analyze = require('../src/analyze');
const config = require('../src/config');

const router = express.Router()

// 获取文章标题
router.get('/getList', (req, res) => {
  cheerioFunc.start(config.url, (body) => {
    analyze.findTitle(body, (ress) => {
      const data = {
        success: true,
        data: ress,
      }
      res.status(200).send(data);
    })
  })
});

// 获取文章内容
router.get('/getContent', (req, res) => {
  cheerioFunc.start(`${config.url}${req.query.url}`, (body) => {
    analyze.findContent(body, (ress) => {

      const data = {
        success: true,
        data: ress,
      }
      res.status(200).send(data);
    })
  })
})

module.exports = router;
