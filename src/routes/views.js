var express = require('express')
var router = express.Router()

router.get('/',(req,res)=>{
    res.render('home',{current:'home'})
})

router.get('/home',(req,res)=>{
    res.render('home',{current:'home'})
})

router.get('/about',(req,res)=>{
    res.render('about',{current:'about'})
})

router.get('/article',(req,res)=>{
    res.render('article',{current:'article'})
})

router.get('/article/:id',(req,res)=>{
    console.log(req.params.id);
    res.render('article',{current:'article'})
})

router.get('/other',(req,res)=>{
    res.render('other',{current:'other'})
})
module.exports = router
