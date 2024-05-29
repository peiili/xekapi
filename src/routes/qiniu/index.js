const fs = require('fs')
const express = require('express');
const router = express.Router();
const qiniuControl = require('./../../controllers/qiniu'); 
const { error } = require('console');

router.post('/net-resource', function(req, res){
  list = req.body
  let url = '';
  let key = '';
  (function fn(i){
    url = list[i];
    key = url.split('/').pop()
    qiniuControl.getNetResource(url,key,(err, respBody, respInfo)=>{
      if(err){
        error(err)
      }else{
        i++
        if(i<list.length){
          fn(i)
        }else {
          res.send({
            code: 200,
          })
        }
      }
    })
  })(0)
})

module.exports = router