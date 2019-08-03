var express = require('express');
var router = express.Router();
var flatfile = require('flat-file-db');
var db = flatfile.sync('my.db');

function getResults() {
  result=[]
  db.keys().forEach(key=>{
    result.push(db.get(key))
  });
  result.sort(function(a,b) {
    if (a.score == b.score)
      return a.time - b.time
    return b.score - a.score
  })
  console.log(result)
  return result;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var result = getResults()
  res.json(result)
});

router.get('/scoreboard', function(req, res, next) {
  res.render('table', {data: getResults()})
})

router.post('/save', function(req, res, next) {
  var score = parseInt(req.body.score)
  var id = req.body.id || req.body.email
  if (db.has(id)) {
    data = db.get(id)
    if (data.score < score) {
      db.put(id, {
        email: req.body.email,
        score: score,
        time: new Date()
      });
    }
  } else {
    db.put(id, {
      email: req.body.email,
      score: score,
      time: new Date()
    });
}

  res.status(200).send("ok")
})

module.exports = router;
