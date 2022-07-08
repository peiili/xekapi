const fs = require('fs');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const multer = require('multer');
const { rawListeners } = require('process');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname,'/tmp/my-pdf'));
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

router.get('\/*.html|\/$', (req,res) => {
    const files = fs.readdirSync('./src')
    const path = req.path==='/'?'./index.html':req.path
    const hasPage = files.find(e=>'/'+e===path)
    if(hasPage){
        const file = fs.readFileSync(`src${path}`, 'utf-8')
        res.status(200).send(file);
    }else{
        res.status(404).send();
    }
})

const outBasePath = './img/'

router.post('/uploader',upload.single('file'), (req,res) => {  
    const outpath = req.file.originalname.replace('.pdf','')
    const dirs = fs.readdirSync(outBasePath)
    const hasDir = dirs.find(e=>e===outpath)
    if(!hasDir){
        fs.mkdirSync(outBasePath+outpath)
    }
    fs.readFileSync(path.join(__dirname,'/tmp/my-pdf',req.file.originalname))

    // python main.py 需要被转换的文件  转换后的问卷存放位置 文件夹名称
    exec(`python main.py ${path.join(__dirname,'/tmp/my-pdf',req.file.originalname)} ${path.join(__dirname,outBasePath,outpath)} ${outpath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('done');
        console.log(stdout);
        // 在此处会同步等待转换结束后返回响应
        res.redirect(`http://127.0.0.1:${port}/result.html?id=${outpath}`)
    })
    // 异步操作
    // res.redirect(`http://127.0.0.1:${port}/result.html?id=${outpath}`)
})

router.get('/imgs',(req,res) => {
    const {id} = req.query
    let files = []
    files = fs.readdirSync(path.join(__dirname,outBasePath,id))
    res.status(200).send(files.map(e=>{
        return encodeURIComponent('img/'+id+'/'+e) 
    }))
})
router.get('/img/:path',(req,res) => {
    const img = fs.readFileSync('./'+decodeURIComponent(req.params.path))
    res.type('jpg')
    res.status(200).send(img);
})

