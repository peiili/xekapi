const express = require('express');
const enums = require('../controllers/enums')
const router = express.Router();

// 获取文章标题
router.post('/page', (req, res) => {
  var db = req.db
  /**
   * 参数
   * 文章类型，
   * 当前页数，
   * 每页显示条数，默认10
   */
  const { type, status, fuzzy, page, size } = req.body;
  
  let website_id = req.body.website_id

  const auth_key = req.headers.auth_key
  if(auth_key) {
    website_id = req.account[req.headers.auth_key].website_id
  }
  var _page = page-1
  if(_page<0){
    _page = 0
  }
  try {
    let countSql = 'SELECT COUNT(id) FROM `xek_article` WHERE type=? and website_id=? and title like ?'
    let params = [type, website_id, `%${fuzzy||''}%`]
    if(status){
      params.push(status)
      countSql+= 'and status=?;'
    }
    let count = ''
    db.query(countSql, params, (res1)=>{
      count = res1[0]['COUNT(id)']
      const offset =  _page * Number(size) || 0
      const limit = Number(size) || 10
      let sql =
      'SELECT `id`,`title`,`created_date`,`thumbnail`,`description`,`keywords`,`view`, `status` FROM `xek_article` WHERE type = ? AND website_id = ? AND `title` LIKE ? ';
      if(status){
        sql += 'and status=?'
      }
      params.push(...[offset, limit])
      sql+= ' ORDER BY `created_date` DESC LIMIT ?,?;'
  
      db.query(sql, params, e => {
        const data = {
          success: true,
          currentPage: page,
          totalPage: Math.ceil(count/Number(size)),
          count,
          list:e,
          data: {  // 兼容移动端
            currentPage: page,
            totalPage: Math.ceil(count/Number(size)),
            count,
            list:e,
          }
        };
        res.status(200).send(data);
      });
    })
  } catch (error) {
    const data = {
      success: false,
      data: error
    };
    res.status(500).send(data);
  }
});

// 获取文章内容
router.get('/detail', (req, res) => {
  var db = req.db
  const sql = 'SELECT * FROM `xek_article` WHERE id = ?;';
  db.query(sql, [req.query.id], e => {
    const data = {
      success: true,
      data: e[0]
    };
    res.status(200).send(data);
  });
});
// 写入文章内容
router.post('/addContent', (req, res) => {
  var db = req.db
  const sql = 'INSERT INTO  `xek_article` (`title`,`created_date`,`content`,`marked`,`keywords`,`description`,`type`) VALUES(?,NOW(),?,?,?,?,?)';
  var {title,content,marked,keywords,description, type} = req.body;
  db.query(sql,[title,content,marked,keywords,description, type], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
// 更新文章状态
router.put('/status', (req, res) => {
  var db = req.db
  const sql = 'UPDATE `xek_article` SET status=? WHERE `id`=?';
  var { status, id} = req.body;
  db.query(sql,[status, id], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
// 更新文章内容
router.put('/putContent', (req, res) => {
  var db = req.db
  const sql = 'UPDATE `xek_article` SET title=?,content=?,marked=?,keywords=?,description=?,created_date=NOW() WHERE `id`=?';
  console.log(req.body)
  var {title,content,marked,keywords,description, id} = req.body;
  db.query(sql,[title,content,marked,keywords,description, id], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
// 更新文章浏览量
router.get('/view/:id', (req, res) => {
  var db = req.db
  const sql = 'UPDATE `xek_article` xa SET xa.view= xa.view+ 1 where id= ?';
  db.query(sql,[req.params.id], success => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
// 删除文章文章内容
router.delete('/del', (req, res) => {
  var db = req.db
  var id = req.query.id
  const sql = 'delete from `xek_article` WHERE `id`=?';
  db.query(sql,[ id ], () => {
    const data = {
      success: true,
      data: true
    };
    res.status(200).send(data);
  });
});
module.exports = router;
