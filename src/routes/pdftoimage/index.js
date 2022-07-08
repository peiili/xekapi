const fs = require('fs');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const multer = require('multer');
const {putStreams} = require('../../controllers/qiniu');
const {response,errorMsg} = require('../../controllers/reponsecontroller')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join('/tmp/my-pdf'));
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

const outBasePath ='/tmp/my-img/'

router.post('/uploader',upload.single('file'), (req,res) => {
    const name = encodeURIComponent(req.file.originalname)
    const outpath = name.replace('.pdf','')
    const dirs = fs.readdirSync(outBasePath)
    const hasDir = dirs.find(e=>e===outpath)
    if(!hasDir){
        fs.mkdirSync(outBasePath+outpath)
    }
    fs.readFileSync(path.join('/tmp/my-pdf',req.file.originalname))

    // python main.py 需要被转换的文件  转换后的问卷存放位置 文件夹名称
    exec(`python main.py ${path.join('/tmp/my-pdf',name)} ${path.join(outBasePath,outpath)} ${outpath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        let files = []
        files = fs.readdirSync(path.join(outBasePath,outpath))
        res.status(200).send(response(files.map(e=>{
            return  'img/'+encodeURIComponent(outpath+'/'+e) 
        })))
    })
    // 异步操作
    // res.redirect(`http://127.0.0.1:${port}/result.html?id=${outpath}`)
})

router.get('/imgs',(req,res) => {
    const {id} = req.query
    let files = []
    files = fs.readdirSync(path.join(outBasePath,id))
    res.status(200).send(files.map(e=>{
        return  'img/'+encodeURIComponent(id+'/'+e) 
    }))
})
router.get('/img/:path',(req,res) => {
    console.log(req.params.path)
    const img = fs.readFileSync('/tmp/my-img/'+decodeURIComponent(req.params.path))
    res.type('jpg')
    res.status(200).send(img);
})


module.exports = router;