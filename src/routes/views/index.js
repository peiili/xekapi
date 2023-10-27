var fs = require('fs')
var path = require('path')
var express = require('express')
var router = express.Router()
// const db = require('../../database/connection');

router.get('/',(req,res)=>{
    res.render('home',{current:'home'})
})

router.get('/home',(req,res)=>{
    res.render('home',{current:'home'})
})

router.get('/about',(req,res)=>{
    res.render('about',{current:'about'})
})

router.get('/article',(req,res)=>{
  var db = req.db
    const sql =
    'SELECT `id`,`title`,`created_date`,`thumbnail`,`description`,`keywords`,`view` FROM `xek_article` WHERE type = ? AND `status`=? ORDER BY `created_date` DESC LIMIT ?,?;';
  try {
    const countSql = 'SELECT COUNT(id) as total FROM `xek_article` WHERE type=? and status=?'
    let count = ''
    db.query(countSql,['2','1'],res1=>{
      count = res1[0]['total']
      db.query(sql, ['2','1', 0,10], e => {
        console.log(e);
        var option = {
            current:'article',
            articleList:e,
            articleTotal:count
        }
        res.render('article',option)
      });
    })
  } catch (error) {
    console.log(error);
    const data = {
      success: false,
      data: error
    };
    res.status(500)
    res.send(data);
  }
    
})

router.get('/article/:id',(req,res)=>{
  var db = req.db
  const countSql = 'SELECT title,content FROM `xek_article` WHERE id=?'
  db.query(countSql,[req.params.id],data=>{
    var title = data[0].title
    var content = data[0].content
    res.render('articleDetails',{current:'article',title:title,content:content})
  })
  })
  
router.get('/other',(req,res)=>{
  res.render('other',{current:'other'})
})
router.get('/other/binary',(req,res)=>{
  console.log('other/binary');
  res.render('other/binary',{current:'other'})
})

router.get('*.css',(req,res)=>{
    var file = fs.readFileSync(path.join(process.env._root,'src/views',req.url));
    res.setHeader('content-type','text/css;charset=UTF-8')
    res.send(file);
})
router.get('*.js',(req,res)=>{
  var file = fs.readFileSync(path.join(process.env._root,'src/views',req.url));
  res.setHeader('content-type','text/javascript;charset=UTF-8')
  res.send(file);
})
module.exports = router
