const request = require('request');

const appid = '';
const secret = '';
// eslint-disable-next-line import/prefer-default-export

function getAccessToken(callback) {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  request(url, (err, res, body) => {
    if (!err && res) {
      callback(JSON.parse(body));
    } else {
      console.log(err);
    }
  });
}

/**
 * 获取粉丝信息列表
 * @param {*} ACCESS_TOKEN
 * @param {*} callback
 */
function getOpenId(ACCESS_TOKEN, callback) {
  const url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${ACCESS_TOKEN}`;
  request(url, (err, res, body) => {
    if (!err && res) {
      callback(body);
    } else {
      console.log(err);
    }
  });
}

function getUserInfo(ACCESS_TOKEN, OPENID, callback) {
  const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ACCESS_TOKEN}&openid=${OPENID}&lang=zh_CN`;
  request(url, (err, res, body) => {
    if (!err && res) {
      callback(body);
    } else {
      console.log(err);
    }
  });
}

function sendMessage(ACCESS_TOKEN, data, callback) {
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`;
  request(
    {
      url,
      method: 'POST',
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body: data
    },
    (err, res, body) => {
      if (!err && res) {
        callback(body);
      } else {
        console.log(err);
      }
    }
  );
}


function getNumber(callback){
  let formData={'params':'BEvehIahEMZGIT3yW02gFJXpAp9xDtUd9FG4ykCnJ3S/915C56Zmprjq0EQPd7m6tKomBGekbJYAJznTxC+lVg/rzpiDoBpxUdHPf6XjpK8KjqwqEE2vHgCKCSqwt+K8qlvMZ4z183kvSDr+mvOi5p/k6qeBypOEpq6nGxuEYkI='}
 
  request({
    url:'https://xgsz.szcdc.net/crmobile/outpatient/nearby',
    method:'POST',
    form: formData,
    headers: {
      'authority':'xgsz.szcdc.net',
      'pragma':'no-cache',
      'cache-control':'no-cache',
      'appid':'app569d18f5',
      'ybm':'zCZ+Gs/DKNX0Ynf67OVJm3UkhkjCQZW4OZUXjxph09k=',
      'content-type':'application/x-www-form-urlencoded',
      'accept':'application/json, text/plain, */*',
      'otn':'T5XmYOyu78x1s0+QEaY0H3OD6Z9P+wIlmpPZ4yobXaYWvKvjn9f8IYBT7k9z7TqIeVEC5w33Dv4JgEN8uSMOHcKlhyDcyGcaGL8YSgWta+D6BoPXcLwLZf+sXqq79DAP',
      'selfappid':'wx5402a9708b90332e',
      'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'token':'-t-QBdFSOMqZpPfDap0xojimLmOln0qtqvjY2Oz-JCr7zYTxX8MYYxlzPDz5qGU7ZZ_',
      'reservationtoken':'66b84eda50b745fcb7066635bfa4b842',
      'origin':'https://xgsz.szcdc.net',
      'sec-fetch-site':'same-origin',
      'sec-fetch-mode':'cors',
      'sec-fetch-dest':'empty',
      'referer':'https://xgsz.szcdc.net/crmobile/?params=hYAPOVzzgsPD8XXKeSRfCIAES2HjPF7AiPeQ+GK8Nx83AaUgsb3QsXjM0sAEsQLpyAs1DAkehxUcAenLOgG49O3Pcql/2sBSGY0sX151O3HkxaM4HWHTojQG9RWS9Ks1EUncPE8f041G9L4LJc+PvIyibScVawfvCIEowCXO4aJd0cVX6JI5sx6+hEni7myfzfjFBLjNjm1CdceUkJDXj4klwyvENnkRbbtwNcXY/uAwgMqkbHDNKrjO9A+7DnkPkNkw/qu0Q0u38x/JSy1brfIPHHXSs5aRBt65Zpcwpwixvu1sq+0AclkHsRcH6ygs&selfAppId=wx5402a9708b90332e&timeStamp=8606230054674325504',
      'accept-language':'zh-CN,zh;q=0.9'
    }
  }, (err, res, body) => {
    if (!err && res) {
      callback(body);

    } else {
      console.log(err);
    }
  })

}
module.exports = {
  getAccessToken,
  getOpenId,
  sendMessage,
  getUserInfo,
  getNumber
};
