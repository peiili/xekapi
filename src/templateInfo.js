const request = require('request')

const appid = 'wxc0e9b2d814c97c58';
const secretId = '5ba9e527fd05c9d3773a60dbe850ded6';
let accessToken = '';
getAccessToken();
setInterval(() => {
  getAccessToken()
}, 1000 * 60 * 60 * 2);
function getAccessToken() {
  request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secretId}`, (error, e, body) => {
    if (error) throw error;
    accessToken = JSON.parse(body).access_token;
  })
}

function getOpenId(code, callback) {
  request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretId}&js_code=${code}&grant_type=authorization_code`, (err, e, body) => {
    if (err) throw err;
    callback(JSON.parse(body).openid)
  })
}

function sendTemplateInfo(openId, templateId, formID, keywords, callabck) {
  request({
      url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${accessToken}`,
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

module.exports = {
  getAccessToken,
  getOpenId,
  sendTemplateInfo,

}
