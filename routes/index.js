var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.token !== undefined) {
    var user = {
      username: req.session.username,
      profilePicture: req.session.profil_picture,
      id: req.session.id
    };
  }
  res.render('index', { title: 'Express', user: user });
});

module.exports = router;
