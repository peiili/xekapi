const express = require('express');
const db = require('../database/connection');

const router = express.Router();

// 获取文章标题
router.post('/getList', (req, res) => {
  const sql =
    'SELECT `id`,`title`,`created_date`,`thumbnail`,`description` FROM `xek_article` WHERE type = ? AND `title` LIKE ? ORDER BY `created_date` DESC LIMIT ?,?;';

  /**
   * 参数
   * 文章类型，
   * 当前页数，
   * 每页显示条数，默认10
   */
  const { type, fuzzy, page, size } = req.body;
  try {
    db.db(sql, [type, `%${fuzzy}%`, (page - 1) * Number(size) || 0, Number(size) || 10], e => {
      const data = {
        success: true,
        data: e
      };
      res.status(200).send(data);
    });
  } catch (error) {
    const data = {
      success: false,
      data: error
    };
    res.status(500).send(data);
  }
});

// 获取文章内容
router.post('/getContent', (req, res) => {
  const sql = 'SELECT * FROM `xek_article` WHERE id = ? ORDER BY `created_date` DESC;';
  db.db(sql, [req.body.id], e => {
    const data = {
      success: true,
      data: e
    };
    res.status(200).send(data);
  });
});
// 写入文章内容
router.post('/addContent', (req, res) => {
  const sql = 'INSERT INTO  `xek_article` (`title`,`created_date`,`content`,`type`) VALUES(?,?,?,?)';
  db.db(sql,[req.body.title, req.body.date, req.body.content, req.body.type], success => {
    const data = {
      success: success,
      data: true
    };
    res.status(200).send(data);
  });
});
module.exports = router;
