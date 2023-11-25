const mysql = require('mysql');
const { databaseConfig } = require('./databaseConf');
console.log('引入1次');
// 创建连接池

const pool = mysql.createPool({
  connectionLimit: 10,
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database
});
let client = null
/**
 * @param {string} sql 语句
 * @param {object} arr  参数
 * @param {Function} callback
 */
function connect(sql, arr, callback) {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    client = connection
    client.release();
    console.log('connect success');
  });
}
connect()

setInterval(()=>{
  pool.query('select now() time',[],function(err, res){
      console.log(res);
  })
},5*60*1e3)

function query(sql, arr, callback){
  if(client){
    console.log(client);
    const query = client.query(sql, arr, (error, results) => {
      if (error) throw error;
      // client.release();
      callback(results);
    });
       // 打印sql
    console.log(query.sql);
  }
}


module.exports.query = query;
