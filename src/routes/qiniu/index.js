const express = require('express');
const router = express.Router();
const qiniuControl = require('./../../controllers/qiniu'); 
const { error } = require('console');

router.post('/net-resource', function(req, res){
  list = req.body
  let url = '';
  let key = '';
  (function fn(i){
    url = list[i];
    if(url.indexOf('/') > -1) {
      key = url.split('/').pop()
      qiniuControl.uploadNetResource(url,key,(err, respBody, respInfo)=>{
        if(err){
          error(err)
        }else{
          i++
          if(i<list.length){
            fn(i)
          }else {
            res.send({
              code: 200,
            })
          }
        }
      })
    } else {
      i++
      if(i<list.length){
        fn(i)
      }else {
        res.send({
          code: 200,
        })
      }
    }
  })(0)
})
router.get('/net-resource', function(req, res){
  const marker = req.marker || '';
  qiniuControl.getNetResource(marker, (err, respBody, respInfo)=>{
  if(err){
      console.error(err);
      res.status(500).send(err)
    } else {
    /**
     * respBody
     * @param {Object} respBody
     * @param {Object} respBody
     * @param {String} [respBody.marker]
     * @param {Array} respBody.items
     */
      res.send({ prefix: 'http://xek.dlsjf.top', ...respBody})
    }
  })
})

module.exports = router