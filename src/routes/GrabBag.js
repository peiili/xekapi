const express = require('express');
const db = require('../database/connection');
const enums = require('../controllers//enums')
const router = express.Router();

// 获取文章标题
router.post('/getList', (req, res) => {
  const sql =
    'SELECT `id`,`title`,`created_date`,`thumbnail`,`description`,`keywords` FROM `xek_article` WHERE type = ? AND `status`=? AND `title` LIKE ? ORDER BY `created_date` DESC LIMIT ?,?;';

  /**
   * 参数
   * 文章类型，
   * 当前页数，
   * 每页显示条数，默认10
   */
  const { type, status,fuzzy, page, size } = req.body;
  try {
    const countSql = 'SELECT COUNT(id) FROM `xek_article` WHERE type=? and status=?'
    let count = ''
    db.db(countSql,[type,'1'],e=>{
      count = e[0]['COUNT(id)']
    })
    db.db(sql, [type,status,`%${fuzzy}%`, (page - 1) * Number(size) || 0, Number(size) || 10], e => {
      const data = {
        success: true,
        data: {
          currentPage:page,
          total:Math.ceil(count/Number(size)),
          count,
          list:e,
        }
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
  const sql = 'INSERT INTO  `xek_article` (`title`,`created_date`,`content`,`keywords`,`description`,`type`) VALUES(?,NOW(),?,?,?,?)';
  db.db(sql,[req.body.title,req.body.content,req.body.keywords,req.body.description, req.body.type], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
// 更新文章内容
router.put('/putContent', (req, res) => {
  const sql = 'UPDATE `xek_article` SET title=?,content=?,keywords=?,description=?,created_date=NOW() WHERE `id`=?';
  db.db(sql,[req.body.title,req.body.content,req.body.keywords,req.body.description,req.body.id], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
// 删除文章文章内容
router.delete('/delContent', (req, res) => {
  const sql = 'UPDATE `xek_article` SET `status`=? WHERE `id`=?';
  db.db(sql,[enums.articleStatus.DELETED.key,req.query.id], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
module.exports = router;
