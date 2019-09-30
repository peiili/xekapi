const express = require('express')
const request = require('request')

const router = express.Router()
const temp_id = 'YNntNqEqFqHdb5_WJ4vshh4DcRnXFGtyaXJ3ZkeUF0w';
let AccessToken = '';
router.get('/openId', (req, res, err) => {
  request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc0e9b2d814c97c58&secret=e29c8bbdb77f8b895efb833b7c468af8', (error, e, body) => {
    if (error) throw error;
    res.send(body);
    AccessToken = JSON.parse(body).access_token;
    console.log(`AccessToken:${AccessToken}`);
    res.end()
  })
})

let openId = '';
router.get('/login', (req, res) => {
  const secretId = 'e29c8bbdb77f8b895efb833b7c468af8';
  const appid = 'wxc0e9b2d814c97c58';
  request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretId}&js_code=${req.query.code}&grant_type=authorization_code`, (err, e, body) => {
    if (err) throw err;
    openId = JSON.parse(body).openid;
    console.log(`openiD:${openId}`);

    res.writeHead(200, {
      'Set-Cookie': `openId=${openId}`,
      'Content-Type': 'text/plain',
  });
  res.end();
  })
})
let formID = '';
router.get('/sendFormId', (req, res) => {
  formID = req.query.id;
  res.status(200).send({ data: formID })
  const AccessTokens = '26_IEBmPKOzrvK741hcdzim-TQHmq88kumxpoU56o0LVC7O__KbwVQ1d7VER7Dn1rTTQ-QbZJ0O_dGIjNzOlHPj3qtRnTuNrRS3Pn_vk0oAqTNvlB9pYrYRcKWEk_Qq75ltVLkgRNHv_QzLjPc7VNPfAJAKCE';
  console.log(`formID:${formID}`);
  console.log(`AccessTokens:${AccessTokens}`);
  console.log(`openId:${openId}`);
  request({
    url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${AccessTokens}`,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      access_token: AccessTokens,

      // "touser":openId,
      touser: 'o2csK0QWTEojhvGqoXckzastXBho',

      // "template_id":temp_id,
      template_id: 'YNntNqEqFqHdb5_WJ4vshh4DcRnXFGtyaXJ3ZkeUF0w',
      form_id: formID,
      data: {
        keyword1: {
            value: '小燕子',
        },
        keyword2: {
            value: '广东深圳',
        },
        keyword3: {
            value: '2019年10月1日',
        },
        keyword4: {
            value: '2019年10月1日',
        },
    },
    emphasis_keyword: 'keyword2.DATA',
    }),
    function(error, res, body) {

      // if(error) throw error;
      res.status(200).send(res)
      res.end()
    },

  })
})
module.exports = router;
