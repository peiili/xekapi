const config = {
  host: 'rm-bp1r11zh6j1nnf09l1o.mysql.rds.aliyuncs.com',
  password: process.env.DB_PASSWORD,
  user: 'xek',
  database: 'xek'
};
console.log(`password:${process.env.DB_PASSWORD}`);
module.exports = {
  databaseConfig: config
};
