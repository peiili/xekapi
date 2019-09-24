const express = require('express')
const db = require('../database/connection');

const router = express.Router()

// 获取文章标题
router.get('/activeTitleList', (req, res) => {

  // req type 类型
  const sql = 'SELECT `id`,`title`,`created_date`,`thumbnail`,`desc` FROM `qdm174930677_db`.`xek_active` WHERE type = ? ORDER BY `created_date` DESC;'
  db.db(sql, [req.query.type], (e) => {
    const data = {
      success: true,
      data: e,
    }
    res.status(200).send(data);
  })
});

// 获取文章内容
router.post('/activeContent', (req, res) => {
  const sql = 'SELECT * FROM `qdm174930677_db`.`xek_active` WHERE id = ? ORDER BY `created_date` DESC;'
  db.db(sql, [req.body.id], (e) => {
    const data = {
      success: true,
      data: e,
    }
    res.status(200).send(data);
  })
})
module.exports = router;
