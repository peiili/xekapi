const chalk = require('chalk')
const { getOpenId, getUserInfo, sendMessage, getAccessToken,getNumber  } = require('./control');
// const accessToken = '46_iY_7DZr9KnGbyt89nwqiBIQnWjyjVwLewssDIq0NVdJOg8Ymvwut3HwFnb3q1eDapkOIWObcB364MEFGnkaln_E1njF-Y-9u5lVSGqaI_IEiukyMPVgbk8LF8f4kTXDHv8hdd6E0vtF1bzvpOKKcAFASOO';
let accessToken = '';
const tempData = {
  touser: '',
  template_id: 'qeFLl4oWOWwGWBFibQ6N-YsEFNf4Efn_EeEjK2BZkro',
  url: 'https://app.gov.shencom.cn/disease-control/index.html#/drawer/1',
  topcolor: '#FF0000',
  data: {
    User: {
      value: '',
      color: '#173177'
    },
    Area: {
      value: '南山区',
      color: '#173177'
    },
    Name: {
      value: '茶光村社康',
      color: '#173177'
    }
  }
};
function start (){
  getNumber((body)=>{
    const data = JSON.parse(body)
    if(data.data&&data.data.list){
    console.log(chalk.green('开始 \n'))
    data.data.list.forEach(e=>{
      console.log('接种点：',e.outpName)
      console.log('是否可预约',e.nums>0&&e.status=='1'&&e.stock>0?'是':'否')
      if(e.nums>0&&e.status=='1'&&e.stock>0){
        getOpenId(accessToken, list => {
          let arr = [];
          arr = JSON.parse(list).data.openid;
          arr.forEach(e => {
              getUserInfo(accessToken, res, body => {
                const info = JSON.parse(body);
                tempData.touser = info.openid;
                tempData.data.User.value = info.nickname;
                tempData.data.Area.value = info.areaName;
                tempData.data.Name.value = info.outpName;
                sendMessage(accessToken, tempData, err => {
                  console.log(err);
                });
              });
          });
        });
      }
    })
  }
    console.log(chalk.yellow('结束 \n'))
  })
}

getAccessToken((body)=>{
  console.log(body)
  accessToken = body.access_token
})
setInterval(()=>{
  getAccessToken((body)=>{
    console.log(body)
    accessToken = body.access_token
  })
},7100*1000)


let a = 5000
setInterval(()=>{
  start()
  a= ((Math.random()+1)*5000).toFixed(0)
  console.log(a)
},a)
