const mongoose = require('mongoose');
const db = require('./../connt');

db();
const ServerUriSchema = new mongoose.Schema({
  name: String,
  path: String,
  describe: String,
  createdTime: Date,
});
mongoose.model();
