const express = require('express');
const router = express.Router();
const { imageToHash } = require('./../../controllers/convertblurhash')
const { uploader } = require('./../attachment')
const {response,errorMsg} = require('../../controllers/reponsecontroller');
const multer = require('multer');
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, '/tmp/my-img');
  },
  filename (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
router.post('/short',upload.single('file'),(req,res)=>{
  imageToHash(req.file.path,({hash,width,height})=>{
    res.status(200).send(response({hash,width,height}))
  })
})

module.exports = router;