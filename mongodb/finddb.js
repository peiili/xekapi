const Article = require('./schema/ArtcalSchema.js');

Article.find({}, (err, docs) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Result:${docs}`);
});
