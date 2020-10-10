var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/shorten', function(req, res, next) {
  res.send('respond with a shorten');
});

module.exports = router;
