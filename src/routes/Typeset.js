// 附件上传， form
const express = require('express');
const fs = require('fs')
const db = require('../database/connection');
const { uploader } = require('./attachment')
const router = express.Router();
const multer = require('multer');
const {response,errorMsg} = require('../controllers/reponsecontroller');
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, '/tmp/my-img');
  },
  filename (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
router.post('/uploader', upload.single('file'),(req,res)=>{
  uploader(req,res,(path,id)=>{
    const typesetSql = 'insert into `xek_typeset` (`attachment_id`,`create_time`) values (?,NOW());';
    db.db(typesetSql,[id],resp=>{
      res.status(200).send(response({
        file:{
          path,
          id,
        },
        id:resp.insertId,
      }))
    })
  })
})
router.post('/page', (req, res) => {
  const sql =
    'SELECT `id`,`create_date`,`path` FROM `xek_attachment` WHERE `source`=? ORDER BY `create_date` DESC LIMIT ?,?;';

  /**
   * 参数
   * 文章类型，
   * 当前页数，
   * 每页显示条数，默认10
   */
  const { source, page, size } = req.body;
  try {
    const countSql = 'SELECT COUNT(id) FROM `xek_attachment` WHERE source=?'
    let count = ''
    db.db(countSql,[source],e=>{
      count = e[0]['COUNT(id)']
    })
    db.db(sql, [source, (page - 1) * Number(size) || 0, Number(size) || 10], e => {
      const data = {
        success: true,
        data: {
          currentPage:page,
          totalPage:Math.ceil(count/Number(size)),
          count,
          list:e,
        }
      };
      res.status(200).send(data);
    });
  } catch (error) {
    const data = {
      success: false,
      data: error
    };
    res.status(500).send(data);
  }
});
module.exports = router;
