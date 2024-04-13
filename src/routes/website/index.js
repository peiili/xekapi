const express = require('express')
const uuid = require('uuid').v4
const router = express.Router();
const {response,errorMsg} = require('../../controllers/reponsecontroller');

router.post('/add',function(req, res){
  var body = req.body
  var db = req.db
  var params = {
    id: uuid(),
    name: body.name,
    beian: body.beian,
    keywords:body.keywords,
    description:body.description
  }
  var sql = 'insert into xek_website (id, name, beian, keywords, description) values(?,?,?,?,?)'
  var sqlParams = Object.values(params)
  db.query(sql, sqlParams, function(resp){
    res.send({
      code: 200,
      data: {
         id: params.id,
      }
    });
  })
})

router.get('/',function(req,res){
  var sql = 'select * from xek_website where id=?'
  var db = req.db
  db.query(sql,[2],function(resp){
    res.status(200).send(response(resp[0]));
  })
})
router.put('/',function(req,res){
  const { title='',description='',host='',keywords='',copyright='' } = req.body;
  var db = req.db
  var sql = 'update xek_website set title=?,description=?,host=?,keywords=?,copyright=? where id=2'
  db.query(sql,[title,description,host,keywords,copyright],function(resp){
    res.status(200).send({
      title,
      description,
      host,
      keywords,
      copyright
    });
  })
})

module.exports=router

