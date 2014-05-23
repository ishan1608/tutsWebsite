var express = require('express');
var router = express.Router();

// Redirect to google using 403 status code
router.get('/', function(req, res) {
    res.redirect(301, 'https://www.google.co.in')
});

module.exports = router;