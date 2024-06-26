const express = require('express');
const uuid = require('uuid').v4
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
  var db = req.db
  const sql = 'INSERT INTO xek_feedback (open_id,feedback,created_date) VALUES (?,?,NOW())';
  db.query(sql, [req.body.openId, req.body.feedback], () => {
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
  var db = req.db
  if (req.query.openId) {
    sql = `SELECT * FROM xek_feedback WHERE open_id = ${req.query.openId}`;
  } else {
    sql = `SELECT * FROM xek_feedback WHERE status = '${req.query.status}'`;
  }
  db.query(sql, [], e => {
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
  var db = req.db
  getOpenId(req.params[0], openid => {
    const sql = `SELECT xek_register.id,xek_active.title,xek_active.open_date FROM xek_register
      LEFT JOIN xek_active on xek_register.active_id = xek_active.id WHERE open_id = ?`;
    db.query(sql, [openid], e => {
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
  var db = req.db
  getOpenId(req.params['0'], openid => {
    const sql = 'SELECT * FROM xek_register WHERE open_id = ?';
    db.query(sql, [openid], arr => {
      res.status(200).send(arr);
    });
  });
});

// 用户登录
router.post('/login', (req, res) => {
  var db = req.db
  const sql = 'select * from xek_user WHERE pass_word = ? AND name = ?';
  const {password, username, type} = req.body
  db.query(sql, [ password, username ], arr => {
    let data = {};
    var token = uuid()
    req.account[token] = arr[0] 
    if (arr.length) {
      data = {
        status: 'ok',
        type,
        websiteId: arr[0].website_id,
        currentAuthority: token,
      };
    } else {
      data = {
        status: 'error',
        message: '账号或密码错误'
      };
    }
    res.status(200).send(data);
  });
});
// 用户登出
router.post('/logout', (req, res) => {
    const auth_key = req.headers['x-auth-key']
    req.account[auth_key] = undefined
    res.status(200).send({
      
    });
});
// 用户详情
router.get('/currentUser', (req, res) => {
  res.status(200).send({
    success: true,
    data: req.account[req.headers['x-auth-key']]
  });
});
module.exports = router;
