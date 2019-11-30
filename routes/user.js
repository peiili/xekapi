const express = require('express')
const db = require('../database/connection');

const router = express.Router()

/**
 *   提交 反馈
 */
router.post('/feedback', (req, res) => {
    console.log(req.body)
    const sql = 'INSERT INTO xek_feedback (unionid,feedback,created_date) VALUES (?,?,NOW())'
    db.db(sql, [req.body.unionid, req.body.feedback], () => {
 const data = {
      success: true,
      data: {
        createdDate: new Date(),
        feedback: req.body.feedback,
      },
    }
    res.status(200).send(data);
    })
})

/**
 * 获取反馈
 */
router.get('/feedback', (req, res) => {
  const sql = 'SELECT * FROM xek_feedback WHERE unionid = ?'
  db.db(sql, [req.query.unionid], (e) => {
    console.log(e);
    const data = {
      success: true,
      data: e,
    }
    res.status(200).send(data);

  })
})
module.exports = router
