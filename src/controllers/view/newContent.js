module.exports  = function(req, res){
  var db = req.db
  var id = req.query.id
  var sql = ''
  if(id) {
    sql = `select id, content, datetime from news where id=${id}`
  } else {
    sql = `select id, content, datetime from news limit 1`
  }
  db.query(sql, [], function(rows){
    var {id,content,datetime} = rows[0]
    var result = {
      id,
      content:JSON.parse(content),
      date_time:datetime,
    }
    console.log(result);
    res.render('news-content',{ result:result })
  })
}