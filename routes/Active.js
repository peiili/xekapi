const express = require('express');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const db = require('../database/connection');

const router = express.Router()

// 获取文章标题
router.get('/activeTitleList', (req, res) => {

	// req type 类型
	const sql = 'SELECT `id`,`title`,`created_date`,`thumbnail`,`desc` FROM `qdm174930677_db`.`xek_active` WHERE type = ? ORDER BY `created_date` DESC;'
	db.db(sql, [req.query.type], (e) => {
		const data = {
			success: true,
			data: e,
		}
		res.status(200).send(data);
	})
});

// 获取文章内容
router.post('/activeContent', (req, res) => {
	const sql = 'SELECT * FROM `qdm174930677_db`.`xek_active` WHERE id = ? ORDER BY `created_date` DESC;'
	db.db(sql, [req.body.id], (e) => {
		const data = {
			success: true,
			data: e,
		}
		res.status(200).send(data);
	})
})

// 临时存储验证码
const tempCode = {};

// 获取验证码
router.post('/getAuditCode', (req, res) => {
	const token = jwt.sign({
		foo: 'bar',
	}, 'shhhhh');
	let code = '';
	for (let i = 0; i < 4; i += 1) {
		code += Math.floor(Math.random() * 10).toString()
	}
	tempCode[req.body.mobilePhone] = code;
	console.log(tempCode);
	res.status(200).send({
		token,
		code: `测试阶段不发送短信验证码，验证码${code}`,
	})

})

// 提交活动报名信息
router.post('/uploadVisitorInfo', (req, res) => {

	// 验证验证码的有效性
	if (req.body.auditCode == tempCode[req.body.mobilePhone]) {
		delete tempCode[req.body.mobilePhone];
		const { body } = req;
		const data = {
			success: true,
			data: {
				...req.body,
				id: uuidv4(),
			},
		}
		const sql = 'INSERT INTO `qdm174930677_db`.`xek_register` (id,active_id, name, mobile_phone,student_id,create_date) VALUES (?,?,?,?,?,NOW());'
		const sqlArr = [data.data.id, body.active.id, body.userName, body.mobilePhone, body.studentID]
		db.db(sql, sqlArr, (e) => {
			console.log(e);

			// const data = {
			// 	success: true,
			// 	data: e,
			// }

			// res.status(200).send(data);
		})
		res.status(200).send(data)
	} else {
		const data = {
			success: false,
			data: {},
			errorMessage: '验证码错误',
		}
		res.status(200).send(data)
	}

})
module.exports = router;
