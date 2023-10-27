// 附件上传， form
const express = require('express');
const fs = require('fs')
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
    var db = req.db
    const typesetSql = 'insert into `xek_typeset` (`attachment_id`,`create_time`) values (?,NOW());';
    db.query(typesetSql,[id],resp=>{
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
  var db = req.db

  /**
   * 参数
   * 文章类型，
   * 当前页数，
   * 每页显示条数，默认10
   */
  const { page, size } = req.body;
  try {
    const countSql = 'SELECT COUNT(id) FROM `xek_typeset`'
    let count = ''
    db.query(countSql,[],e=>{
      count = e[0]['COUNT(id)']
    })
    const sql = 'SELECT xt.`id`,xt.`create_time`,xt.`start`,xt.`download`,xa.`id` AS `xa_id`,xa.`path` AS `xa_path` FROM `xek_typeset` xt LEFT JOIN `xek_attachment` `xa` ON xt.`attachment_id`=xa.`id` ORDER BY `create_time` DESC LIMIT ?,?;';

    db.query(sql, [(page - 1) * Number(size) || 0, Number(size) || 10], e => {
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
router.put('/',(req,res)=>{
  var db = req.db
  const {start,download,id} =req.body
  const sql = 'UPDATE `xek_typeset` SET'+ (start?('`start`='+start):'')+(download?('`download`='+download):'')+' WHERE `id`=?'
  if(!id){
    res.status(400).send(errorMsg('id is required'))
    return;
  }
  if(!start&&!download){
    res.status(400).send(errorMsg('start or download is required'))
    return;
  }
  db.query(sql,[id],(resp)=>{
    console.log(resp)
    res.status(200).send(response({
        data:'success',
      }))
  })
})
module.exports = router;
