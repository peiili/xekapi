const request = require('request');
const config = require('./config');
const analyze = require('./analyze');
const db = require('../database/connection');

// 请求dom数据
function start(url, callback) {
    request(url, (err, res, body) => {
      if (!err && res) {
        callback(body)
      } else {
        console.log(err);
      }
  })
}

// 定时爬取网站内容
// const titleList = [];
let num = 0;
function loopGetContent() {

  start(config.url, (body) => {
      analyze.findTitle(body, (ress) => {
        num += 1
        ress.forEach(e => {
          start(`${config.url}${e.href}`, (content) => {
              analyze.findContent(content, (res) => {

                // 通过当前title 查询是否有历史数据
                const selectSql = 'SELECT * FROM `qdm174930677_db`.`xek_article` WHERE `title` = ?'

                db.db(selectSql, `${res.title}`, (reslu) => {

                  // 判断原数据库是否有对应的title
                  if (!reslu.length) {
                    const insertSql = 'INSERT INTO  `qdm174930677_db`.`xek_article` (`title`,`created_date`,`content`,`type`) VALUES(?,?,?,?)'
                    db.db(insertSql, [`${res.title}`, res.date[0], JSON.stringify(res.content), '1'], (status) => {
                      console.log(status);

                    })
                  } else {
                    return;
                  }

                })

              })
            })
        });
        console.log(`已安全获取${num}次`);
      })
    })
}

// 每一小时爬取一次
function getDomData() {
  setInterval(() => {
   loopGetContent()
 }, 1000 * 6 * 10 * 60)
}
module.exports.start = getDomData;
