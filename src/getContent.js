const db = require('./../database/connection');

const sql = 'SELECT * FROM `qdm174930677_db`.`xek_article` LIMIT 1000;'
function getData(callback) {
  db.getDb(sql, [], (res) => {
    callback(res)
  });
}

module.exports.getSql = getData
