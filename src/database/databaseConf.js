const production = {
  host: '127.0.0.1',
  password: process.env.DB_PASSWORD,
  user: 'root',
  database: 'xek'
};
console.log(`password:${process.env.DB_PASSWORD}`);
const devs = {
  host: '47.105.113.47',
  password: 'ZZZ123456',
  user: 'root',
  database: 'xek_test'
};
let env = '';
env = process.env.NODE_ENV;
module.exports = {
  databaseConfig: env.trim() === 'development' ? devs : production
};
