const express = require('express');
const db = require('../database/connection');

const router = express.Router();

router.get('/randomBing', (req, res) => {
  const sql = 'SELECT * FROM `xek_bing` ORDER BY RAND() LIMIT 1;';
  console.log(sql);
  db.db(sql, [], resp => {
    console.log(resp[0].name);
    console.log(req.query);
    res.redirect(302, `https://www.dlsjf.top/${resp[0].name}?imageView2/2/w/${req.query.w}`);
  });
});
module.exports = router;
