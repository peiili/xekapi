module.exports  = function(req, res){
  var db = req.db
  var sql = `select id, DATE_FORMAT(createdate, '%Y-%m-%d') createdate,TIME_FORMAT(createtime, '%H:%i:%s') createtime from news`
  db.query(sql, [], function(result){
    console.log(result);
    res.render('home',{current:'home',list:result})
  })
}