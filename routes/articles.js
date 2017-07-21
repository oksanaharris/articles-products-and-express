var express = require('express');
var router = express.Router();

router.get('/', function (req, res){
  res.send('all articles');
});

router.get('/:id', function (req, res){
  res.send('some article');
});

router.post('/', function (req, res){
  res.send('creating an article');
});

router.put('/:id', function (req, res){
  res.send('update an article');
});







module.exports = router;