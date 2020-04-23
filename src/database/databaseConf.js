const production = {
  host: '127.0.0.1',
  password: process.env.DB_PASSWORD,
  user: 'root',
  database: 'xek'
};
const devs = {
  host: '47.105.113.47',
  password: process.env.DB_PASSWORD,
  user: 'root',
  database: 'xek_test'
};
let env = '';
env = process.env.NODE_ENV;
console.log(process.env.NODE_ENV);
module.exports = {
  databaseConfig: env.trim() === 'development' ? devs : production
};
