const express = require('express')
const db = require('../database/connection');

const { getOpenId, getPaidUnionId } = require('../src/templateInfo');

const router = express.Router()

/**
 * 获取用户unionId
 */

 router.get('/getUnionId/*', (req, res) => {
   getOpenId(req.params[0], (openId) => {
    console.log(openId);
    res.status(200).send({
      data: {
        openId,
      },
    })
   })

  // getOpenId(req)
 })

/**
 *   提交 反馈
 */
router.post('/feedback', (req, res) => {
    console.log(req.body)
    const sql = 'INSERT INTO xek_feedback (open_id,feedback,created_date) VALUES (?,?,NOW())'
    db.db(sql, [req.body.openId, req.body.feedback], () => {
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
  let sql = '';
  console.log(req.query)
  if (req.query.openId) {
     sql = `SELECT * FROM xek_feedback WHERE open_id = ${req.query.openId}`
  } else {
     sql = `SELECT * FROM xek_feedback WHERE status = '${req.query.status}'`
  }
  db.db(sql, [], (e) => {
    console.log(e);
    const data = {
      success: true,
      data: e,
    }
    res.status(200).send(data);

  })
})

module.exports = router
