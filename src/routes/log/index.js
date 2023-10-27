const express = require('express');
const router = express.Router();
const request = require('request')
// const db = require('../../database/connection');
const {response,errorMsg} = require('../../controllers/reponsecontroller');

var store = {} 
function getIpAddress(ip,cb){
  var url = `https://opendata.baidu.com/api.php?query=${ip}&co=&resource_id=6006&oe=utf8`
  request.get(url,(err,res,body)=>{
    if(err){
      throw err
    }else{
      var _body = JSON.parse(body)
      if(_body.status==='0'){
        cb(_body.data[0].location)
      }else{
        cb('unknown')
      }
    }
  })
}
/**
 * 写入数据库
 * @param {Object} db 
 * @param {Array} data 
 */
function toDb(db,data,res){
  var db = req.db
  var sql = `insert into custom_logs (ip,host,tag,create_time,user_data,user_client,location) values (?,?,?,NOW(),?,?,?)`
  db.query(sql,data,()=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.status(200).send(response({}))
  })
}
router.get('/',(req,res)=>{
  // var ip = req.ip
  var host = req.headers['referer']
  var tag = req.query.tag
  var user_data = req.query.userData||''
  var user_client = JSON.stringify(req.rawHeaders)
  // 使用nginx 代理时无法获取真实ip，需要在nginx中自定义请求头进行转发真实ip
  var ip = req.headers['x-real-ip']
  if(!tag){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.status(400).send(errorMsg('tag is required'))
    return
  }
  var location = ''
  if(store[ip]){
    location = store[ip]
    var data = [ip,host,tag,user_data,user_client,location]
    toDb(db,data,res)
  }else{
    getIpAddress(ip,function(dst){
      store[ip] = dst
      location = dst
      var data = [ip,host,tag,user_data,user_client,location]
      toDb(db,data,res)
    })
  }
 
})
router.get('/tongji',(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','*');
  res.status(200).contentType('application/javascript').send('')
})

module.exports = router; 