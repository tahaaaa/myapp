var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function splashPageRender(req, res) {
  res.render('index2', {
    title: 'Express'
  });
});


module.exports = router;
