const mysql = require('mysql');
const config = require('./databaseConf');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

/**
 * @param {string} sql 语句
 * @param {object} arr  参数
 * @param {Function} callback
 */
function getDb(sql, arr, callback) {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    const query = connection.query(sql, arr, (error, results, fields) => {
      if (error) throw error;
      connection.release()
      callback(results)
    });

    // 打印sql
    console.log(query.sql);
  })
}

module.exports.db = getDb;
