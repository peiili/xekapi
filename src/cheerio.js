const request = require('request');

function start(url, callback) {
    request(url, (err, res, body) => {
      if (!err && res) {
        callback(body)
      } else {
        console.log(err);
      }
  })
}
module.exports.start = start;
