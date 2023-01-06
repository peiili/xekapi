const express = require('express');
const router = express.Router();
const db = require('../../database/connection');
const {response,errorMsg} = require('../../controllers/reponsecontroller');
router.get('/',(req,res)=>{
  // var ip = req.ip
  var host = req.query.hostname||''
  var tag = req.query.tag
  var user_data = req.query.userData||''
  var user_client = JSON.stringify(req.rawHeaders)
  // 使用nginx 代理时无法获取真实ip，需要在nginx中自定义请求头进行转发真实ip
  var ip = req.headers['x-real-ip']
  if(!tag){
    res.status(400).send(errorMsg('tag is required'))
    return
  }
  var sql = `insert into custom_logs (ip,host,tag,create_time,user_data,user_client) values (?,?,?,NOW(),?,?)`
  db.query(sql,[ip,host,tag,user_data,user_client],()=>{
    res.status(200).send(response({}))
  })
})

module.exports = router; 