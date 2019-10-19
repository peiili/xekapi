const express = require('express')
const db = require('../database/connection');

const router = express.Router()

// 获取文章标题
router.get('/getList', (req, res) => {

  // req type 类型
  const sql = 'SELECT `id`,`title`,`created_date`,`thumbnail`,`desc` FROM `qdm174930677_db`.`xek_article` WHERE type = ? ORDER BY `created_date` DESC LIMIT ?,?;'

  /**
   * 参数
   * 文章类型，
   * 当前页数，
   * 每页显示条数，默认10
   */
  const { type, page, size } = req.query;
  try {
    db.db(sql, [type, (page - 1) * Number(size) || 0, Number(size) || 10], (e) => {
      const data = {
        success: true,
        data: e,
      }
      res.status(200).send(data);
    })
  } catch (error) {

  }

});

// 获取文章内容
router.post('/getContent', (req, res) => {
  const sql = 'SELECT * FROM `qdm174930677_db`.`xek_article` WHERE id = ? ORDER BY `created_date` DESC;'
  db.db(sql, [req.body.id], (e) => {
    const data = {
      success: true,
      data: e,
    }
    res.status(200).send(data);
  })
})
module.exports = router;
