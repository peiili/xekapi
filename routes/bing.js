const express = require('express')
const db = require('../database/connection');

const router = express.Router()

router.get('/randomBing', (req, res) => {
    const sql = 'SELECT * FROM xek_bing WHERE id >= ((SELECT MAX(id) FROM xek_bing) - (SELECT MIN(id) FROM xek_bing)) * RAND() + (SELECT MIN(id) FROM xek_bing) LIMIT 1 ;'
    db.db(sql, [], (resp) => {
        console.log(resp[0].name);
        console.log(req.query);
        res.redirect(302, `https://www.dlsjf.top/${resp[0].name}?imageView2/2/w/${req.query.w}`);
    })
})
module.exports = router;
