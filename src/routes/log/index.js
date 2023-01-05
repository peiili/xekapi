const express = require('express');
const router = express.Router();
const db = require('../../database/connection');
const {response,errorMsg} = require('../../controllers/reponsecontroller');
router.get('/',(req,res)=>{
  var ip = req.ip
  var host = req.hostname
  var tag = req.query.tag
  var user_data = req.query.userData||''
  var user_client = JSON.stringify(req.rawHeaders)
  if(!tag){
    res.status(400).send(errorMsg('tag is required'))
  }
  var sql = `insert into custom_logs (ip,host,tag,create_time,user_data,user_client) values (?,?,?,NOW(),?,?)`
  db.query(sql,[ip,host,tag,user_data,user_client],()=>{
    res.status(200).send(response({}))
  })
})

module.exports = router; 