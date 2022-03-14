// 附件上传， form
const express = require('express');
const db = require('../database/connection');
const multer = require('multer');
const fs = require('fs')
const {putStream,formStreams} = require('../controllers/qiniu');

const router = express.Router();

const {response,errorMsg} = require('../controllers/reponsecontroller')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, '/tmp/my-img');
  },
  filename (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
router.post('/', upload.single('image'), (req, res) => {
  const key = `tmp/${req.file.originalname}`;
  const localFile = `/tmp/my-img/${req.file.originalname}`;

  // const rs = fs.createReadStream(`/tmp/my-img/${req.file.originalname}`, {
  //   flags: 'r',

  //   // 数据编码，如果调置了该参数，则读取的数据会自动解析
  //   // 如果没调置，则读取的数据会是 Buffer
  //   // 也可以通过 rs.setEncoding() 进行设置
  //   // encoding: 'utf8',

  //   // 文件描述符，默认为null
  //   // fd: null,

  //   // 文件权限
  //   mode: 0o666,

  //   // 文件读取的开始位置
  //   start: 0,

  //   // 文件读取的结束位置(包括结束位置)
  //   end: Infinity,

  //   // 读取缓冲区的大小，默认64K
  //   highWaterMark: 3
  // });

  putStream(key, localFile);
  res.send();
});
router.post('/uploader', upload.single('file'), (req, res) => {
  const key = `typeset/${req.file.originalname}`;
  const localFile = `/tmp/my-img/${req.file.originalname}`;
  const stream = fs.createReadStream(localFile)
  formStreams(key,stream,((respInfo,respBody)=>{
    if (respInfo.statusCode == 200) {
      // console.log(respBody)
      const sql = 'insert into `xek_attachment` (`hash`,`path`,`source`,`create_date`) values (?,?,?,NOW());';
      const value = [respBody.hash,key, req.body.source];
      db.db(sql, value, resp => {
        res.status(200).send(response({
          data:key
        }))
      });
    } else {
      console.log(respInfo.statusCode);
      console.log('qiniu-'+respBody);
    }


  }))
})
module.exports = router;
