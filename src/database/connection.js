const mysql = require('mysql');
const { databaseConfig } = require('./databaseConf');

// 创建连接池

const pool = mysql.createPool({
  connectionLimit: 10,
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database
});

/**
 * @param {string} sql 语句
 * @param {object} arr  参数
 * @param {Function} callback
 */
function getDb(sql, arr, callback) {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    const query = connection.query(sql, arr, (error, results) => {
      if (error) throw error;
      console.log('connect success');
      connection.release();
      callback(results);
    });

    // 打印sql
    console.log(query.sql);
  });
}

module.exports.db = getDb;
