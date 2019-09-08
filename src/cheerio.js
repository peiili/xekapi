const request = require('request');
const config = require('./config');
const analyze = require('./analyze');

function start(callback) {
  new Promise((resove, reject) => {
    request(config.url, (err, res, body) => {
      if (!err && res) {
        analyze.findContent(body, (ress) => {
          resove(ress)
        })
      } else {
        reject(err)
      }
    })
  }).then(res => {
    callback(res)
  })
}
module.exports.start = start;
