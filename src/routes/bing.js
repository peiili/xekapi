const express = require('express');
const router = express.Router();
const {response,errorMsg} = require('../controllers/reponsecontroller')

router.get('/randomBing', (req, res) => {
  const sql = 'SELECT * FROM `xek_bing` ORDER BY RAND() LIMIT 1;';
  var db = req.db
  db.query(sql, [], resp => {
    res.redirect(302, `https://xek.dlsjf.top/${resp[0].name}?imageView2/2/w/${req.query.w}`);
  });
});
// 分页查询图库图片
router.post('/page', (req, res) => {
  const {page,size,desc} = req.body
  var db = req.db
  if(Number(page)&&Number(size)){
    let sql = `SELECT * FROM xek_bing xb ORDER BY xb.create_date ${desc?'DESC':''} LIMIT ?,?`;
    db.query(sql, [(page-1)*size,size], resp => {
      res.status(200).send(response(resp))
    });
  }else{
    res.status(400).send(errorMsg('page,size must be number'))
  }
});

router.get('/randomBingList', (req, res) => {
  var db = req.db
  const sql = 'SELECT * FROM `xek_bing` ORDER BY RAND() LIMIT ?;';
  db.query(sql, [Number(req.query.limit)], resp => {
    res.status(200).send(response(resp));
  });
});

module.exports = router;
