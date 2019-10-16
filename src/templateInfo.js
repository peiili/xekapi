const request = require('request')

function getAccessToken(callback) {
  let AccessToken = '';
  request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc0e9b2d814c97c58&secret=e29c8bbdb77f8b895efb833b7c468af8', (error, e, body) => {
    if (error) throw error;
    AccessToken = JSON.parse(body).access_token;
    callback(AccessToken)
  })
}

function getOpenId(code, callback) {
  const secretId = 'e29c8bbdb77f8b895efb833b7c468af8';
  const appid = 'wxc0e9b2d814c97c58';
  request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretId}&js_code=${code}&grant_type=authorization_code`, (err, e, body) => {
    if (err) throw err;
    callback(JSON.parse(body).openid)
  })
}

function sendTemplateInfo(AccessTokens, openId, templateId, formID, keywords, callabck) {
  request({
      url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${AccessTokens}`,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        access_token: AccessTokens,
        touser: openId,
        template_id: templateId,
        form_id: formID,
        page: 'pages/activeRegister/index',
        data: {
          keyword1: {
            value: keywords.keywords1,
          },
          keyword2: {
            value: keywords.keywords2,
          },
          keyword3: {
            value: keywords.keywords3,
          },
          keyword4: {
            value: keywords.keywords4,
          },
        },
        emphasis_keyword: 'keyword2.DATA',
      }),

    },
    (error, res) => {

      if (error) throw error;
      callabck(res)
    })
}
module.exports.getAccessToken = getAccessToken;
module.exports.getOpenId = getOpenId;
module.exports.sendTemplateInfo = sendTemplateInfo;
