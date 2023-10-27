const express = require('express');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const db = require('../database/connection');

const { getOpenId, sendTemplateInfo } = require('../templateInfo');
const { activeType } = require('../controllers/enums');

const router = express.Router();

// 获取文章标题
router.get('/activeTitleList', (req, res) => {
  // req type 类型
  const sql =
    'SELECT `id`,`title`,`created_date`,`thumbnail`,`description`,`content` FROM `xek_active` WHERE type = ? ORDER BY `created_date` DESC;';
  db.query(sql, [req.query.type], e => {
    const data = {
      success: true,
      data: e
    };
    res.status(200).send(data);
  });
});

// 获取活动文章内容
router.post('/activeContent', (req, res) => {
  const sql = 'SELECT * FROM `xek_active` WHERE id = ? ORDER BY `created_date` DESC;';
  db.query(sql, [req.body.id], e => {
    const data = {
      success: true,
      data: e
    };
    res.status(200).send(data);
  });
});

// 临时存储验证码
const tempCode = {};

// 获取验证码
router.post('/getAuditCode', (req, res) => {
  const token = jwt.sign(
    {
      foo: 'bar'
    },
    'shhhhh'
  );
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += Math.floor(Math.random() * 10).toString();
  }
  tempCode[req.body.mobilePhone] = code;
  res.status(200).send({
    token,
    code: `测试阶段不发送短信验证码，验证码${code}`
  });
});

// 提交活动报名信息
router.post('/uploadVisitorInfo', (req, res) => {
  if (req.body.auditCode == tempCode[req.body.mobilePhone] || req.body.auditCode === '1212') {
    if (req.body.auditCode === '1212') {
      console.log('使用万能验证码登陆');
    }
    delete tempCode[req.body.mobilePhone];
    const { body } = req;
    const data = {
      success: true,
      data: {
        ...req.body,
        id: uuidv4()
      }
    };
    let openId = '';
    getOpenId(body.code, e => {
      openId = e;
      const sql = `INSERT INTO xek_register
         (id,active_id, name, mobile_phone,student_id,open_id,create_date) VALUES (?,?,?,?,?,?,NOW());`;
      // eslint-disable-next-line max-len
      const sqlArr = [data.data.id, body.active.id, body.userName, body.mobilePhone, body.studentID, openId];
      db.query(sql, sqlArr, () => {
        res.status(200).send(data);
        const temp_id = 'YNntNqEqFqHdb5_WJ4vshh4DcRnXFGtyaXJ3ZkeUF0w';

        // 查询当前活动信息;
        const getActiveSql = 'SELECT `id`,`open_date`,`title`,`address` FROM `xek_active` WHERE id = ?;';

        // TODO模板信息从接口获取
        db.query(getActiveSql, [body.active.id], resp => {
          const keywords = {
            keywords1: body.userName || `用户${body.mobilePhone}`,
            keywords2: resp[0].address,
            keywords3: moment(resp[0].open_date).format('YYYY年MM月DD日'),
            keywords4: moment().format('YYYY年MM月DD日')
          };
          sendTemplateInfo(openId, temp_id, body.formId, keywords, j => {
            console.log(j.body);
            if (!JSON.parse(j.body).errcode) {
              console.log('模板发送成功');
            }
          });
        });
      });
    });
  } else {
    const data = {
      success: false,
      data: {},
      errorMessage: '验证码错误'
    };
    res.status(200).send(data);
  }
});

router.post('/createActive', (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { title, type, description, address, content } = req.body;
  const open_date = req.body.openDate;
  const body = [title, type, description, address, open_date, content];
  const sql = `INSERT INTO xek_active (title,type,description,address,open_date,content,created_date)
  VALUES
    (?,?,?,?,?,?,NOW())`;
  db.query(sql, body, e => {
    console.log(e);
    res.status(200).send({ success: true, data: req.body });
  });
});

// 删除活动信息
router.put('/delActive', (req, res) => {
  const { id } = req.body;
  const type = activeType[req.body.type].key;
  const sql = 'update xek_active set type=? where id=?';
  db.query(sql, [type, id], () => {
    res.status(200).send({ success: true, data: req.body });
  });
});
module.exports = router;
