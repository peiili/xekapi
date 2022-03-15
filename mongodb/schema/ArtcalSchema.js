const mongoose = require('mongoose');
const db = require('./../connt');

db();

// 定义文档
const ArticleSchmea = new mongoose.Schema({
  title: String,
  author: String,
  contnet: String,
  publishTime: Date,
});
const Article = mongoose.model('Article', ArticleSchmea);

module.exports = Article;
