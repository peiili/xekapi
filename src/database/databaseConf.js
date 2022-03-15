const config = {
  host: '127.0.0.1',
  password: process.env.DB_PASSWORD,
  user: 'root',
  database: 'xek'
};
console.log(`password:${process.env.DB_PASSWORD}`);
module.exports = {
  databaseConfig: config
};
