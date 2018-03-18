var express = require('express');
var router = express.Router();

/* GET car page. */
router.get('/', function (req, res, next) {
	res.send('car - respond with a resource');
});

module.exports = router;
