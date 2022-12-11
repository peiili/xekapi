const express = require('express');
const db = require('../../database/connection');
const router = express.Router();
const { getOpenId, getUserInfo, sendMessage, getAccessToken,getNumber,getQrcode  } = require('./control');
let accessToken = ''
getAccessToken((body)=>{
  accessToken = body.access_token
})
setInterval(()=>{
  getAccessToken((body)=>{
    // console.log(body)
    accessToken = body.access_token
  })
},7100*1000)
// 获取文章标题
router.post('/subscribe/qrcode', (req, res) => {
    const body = req.body
    getQrcode(accessToken,body,function(response){
      res.status(200).send(response)
    })
});
/**
 * 获取微信发送的事件消息
 */
router.post('/message', (req, res) => {
  console.log(req.body)
        res.status(200).send('')
    // const body = req.body
    // getQrcode(accessToken,body,function(response){
    //   res.status(200).send(response)
    // })
});

module.exports = router;