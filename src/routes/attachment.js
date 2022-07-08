// 附件上传， form
const express = require('express');
const fs = require('fs')
const moment = require('moment')
const db = require('../database/connection');
const multer = require('multer');
const {putStreams,formStreams} = require('../controllers/qiniu');

const router = express.Router();

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
const uploader =function(req,res,cb){
  const key =  `typeset/${moment().format('YYYYMMDDhhmmss')}-${(Math.random()*100000).toFixed(0)}.${req.file.mimetype.split('/')[1]}`;
  const localFile = `/tmp/my-img/${req.file.originalname}`;
  const stream = fs.createReadStream(localFile)
  formStreams(key,stream,((respInfo,respBody)=>{
    if (respInfo.statusCode == 200) {
      const sql = 'insert into `xek_attachment` (`hash`,`path`,`source`,`create_date`) values (?,?,?,NOW());';
      const value = [respBody.hash,key, req.body.source];
      db.db(sql, value, resp => {
        cb(key,resp.insertId)
      });
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  }))
}

router.post('/', upload.single('image'), (req, res) => {
  const key = `tmp/${req.file.originalname}`;
  const localFile = `/tmp/my-img/${req.file.originalname}`;
  putStreams(key, localFile);
  res.send();
});
router.post('/uploader', upload.single('file'), (req, res) => {
  uploader(req,res,(path,id)=>{
    res.status(200).send(response({
      path,
      id,
    }))
  })
})
router.uploader = uploader
module.exports = router;