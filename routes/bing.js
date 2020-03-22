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

router.get('/randomBingList', (req, res) => {
  const sql = 'SELECT * FROM `xek_bing` ORDER BY RAND() LIMIT ?;';

  //   console.log(sql);
  db.db(sql, [Number(req.query.limit)], resp => {
    const json = {
      success: true,
      data: resp
    };
    res.status(200).send(json);
  });
});

module.exports = router;
