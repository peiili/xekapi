const express = require('express');
const db = require('../../database/connection');

const router = express.Router();
const { getOpenId, getUserInfo, sendMessage, getAccessToken,getNumber,getQrcode,sha1  } = require('./control');

let accessToken = ''
// getAccessToken((body)=>{
//   accessToken = body.access_token
//   console.log(accessToken)
// })
// setInterval(()=>{
//   getAccessToken((body)=>{
//     // console.log(body)
//     accessToken = body.access_token
//   })
// },7100*1000)

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
router.get('/message', (req, res) => {
  console.log(req.query)
  var token = '0ef3cddb45816ff9a8160cf52cee5240'
  var signature = req.query.signature
  var nonce = req.query.nonce
  var timestamp = req.query.timestamp
  var echostr = req.query.echostr
  var str = [token,timestamp,nonce].sort().join('')
  var sha = sha1(str);
  if(sha===signature){
    res.type('html').status(200).send(echostr+'')
  }else{
    res.type('html').status(200).send('wrong')
  }
});
router.post('/message', (req, res) => {
  var xml = req.body.xml
  console.log(xml)
  var token = '0ef3cddb45816ff9a8160cf52cee5240'
  var signature = req.query.signature
  var nonce = req.query.nonce
  var timestamp = req.query.timestamp
  var echostr = req.query.echostr
  var str = [token,timestamp,nonce].sort().join('')
  var sha = sha1(str);
  if(sha===signature){
    var $MsgType = xml.MsgType[0]
    var $fromUsername = xml.FromUserName[0]
    var $toUsername = xml.ToUserName[0]
    var $time = new Date().getTime();
    if($MsgType==='text'){
      var content = xml.Content[0]
      var $contentStr = content+'吧！';
      var $resultStr = `<xml>  
                          <ToUserName><![CDATA[${$fromUsername}]]></ToUserName>  
                          <FromUserName><![CDATA[${$toUsername}]]></FromUserName>  
                          <CreateTime>${$time}</CreateTime>  
                          <MsgType><![CDATA[text]]></MsgType>  
                          <Content><![CDATA[${$contentStr}]]></Content>  
                        </xml>`;
        res.status(200).send($resultStr)
    }else if($MsgType==='event'){
      var Event = xml.Event[0]
      if(Event==='SCAN'){
        var key = xml.EventKey[0]
        var $contentStr = key;
        var $resultStr = `<xml>  
                            <ToUserName><![CDATA[${$fromUsername}]]></ToUserName>  
                            <FromUserName><![CDATA[${$toUsername}]]></FromUserName>  
                            <CreateTime>${$time}</CreateTime>  
                            <MsgType><![CDATA[text]]></MsgType>  
                            <Content><![CDATA[${$contentStr}]]></Content>  
                          </xml>`;
          res.status(200).send($resultStr)

      }
    }else{
      var $contentStr = "您发的消息类型不是文本。而是"+$MsgType;
      var $resultStr = `<xml>  
                          <ToUserName><![CDATA[${$fromUsername}]]></ToUserName>  
                          <FromUserName><![CDATA[${$toUsername}]]></FromUserName>  
                          <CreateTime>${$time}</CreateTime>  
                          <MsgType><![CDATA[text]]></MsgType>  
                          <Content><![CDATA[${$contentStr}]]></Content>  
                        </xml>`;
        res.status(200).send($resultStr)
    }
  }else{
    res.type('xml').status(200).send('wrong')
  }
});

module.exports = router;