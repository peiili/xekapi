const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const { getOpenId } = require('../templateInfo');

const router = express.Router();

/**
 * 获取用户unionId
 */

router.get('/getUnionId/*', (req, res) => {
  getOpenId(req.params['0'], openId => {
    console.log(openId);
    res.status(200).send({
      data: {
        openId
      }
    });
  });

  // getOpenId(req)
});

/**
 *   提交 反馈
 */
router.post('/feedback', (req, res) => {
  console.log(req.body);
  const sql = 'INSERT INTO xek_feedback (open_id,feedback,created_date) VALUES (?,?,NOW())';
  db.db(sql, [req.body.openId, req.body.feedback], () => {
    const data = {
      success: true,
      data: {
        createdDate: new Date(),
        feedback: req.body.feedback
      }
    };
    res.status(200).send(data);
  });
});

/**
 * 获取反馈
 */
router.get('/feedback', (req, res) => {
  let sql = '';
  console.log(req.query);
  if (req.query.openId) {
    sql = `SELECT * FROM xek_feedback WHERE open_id = ${req.query.openId}`;
  } else {
    sql = `SELECT * FROM xek_feedback WHERE status = '${req.query.status}'`;
  }
  db.db(sql, [], e => {
    console.log(e);
    const data = {
      success: true,
      data: e
    };
    res.status(200).send(data);
  });
});

/**
 * 获取当前user所参与的活动
 * userId
 */
router.get('/registerAll/*', (req, res) => {
  getOpenId(req.params[0], openid => {
    const sql = `SELECT xek_register.id,xek_active.title,xek_active.open_date FROM xek_register
      LEFT JOIN xek_active on xek_register.active_id = xek_active.id WHERE open_id = ?`;
    db.db(sql, [openid], e => {
      const data = {
        success: true,
        data: e
      };
      res.send(data);
    });
  });
});

// 使用openId获取当前用户的报名列表
router.get('/userRegistre/*', (req, res) => {
  getOpenId(req.params['0'], openid => {
    const sql = 'SELECT * FROM xek_register WHERE open_id = ?';
    db.db(sql, [openid], arr => {
      res.status(200).send(arr);
    });
  });
});

// 用户登录
router.post('/login', (req, res) => {
  console.log(req.body);
  const sql = 'select * from xek_user WHERE pass_word = ? AND accept = ?';
  const schema = {
    pass_word: req.body.password,
    accept: req.body.accept
  };
  db.db(sql, [schema.pass_word, schema.accept], arr => {
    let data = {};
    if (arr.length) {
      const token = jwt.sign(
        {
          id: arr[0].id
        },
        'jwttoken'
      );
      data = {
        success: true,
        message: '登录成功',
        token
      };
    } else {
      data = {
        success: false,
        message: '账号或密码错误'
      };
    }
    res.status(200).send(data);
  });
});
module.exports = router;
