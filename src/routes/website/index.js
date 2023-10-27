const express = require('express')
const router = express.Router();
const {response,errorMsg} = require('../../controllers/reponsecontroller');

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

