var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
  if (req.session.token == undefined) {
    res.redirect('/');
  }
  // var follows = [];
  // fs.readFile('userInfo.txt', 'utf8', function(err,data){
  //   if (err) {
  //     return console.log(err);
  //   }
  //   user = JSON.parse(data)
  //   // users.forEach(function(user){
  //   //   console.log(user)
  //   //   follows.push(user)
  //   // })
  //
  //   res.render('success', { title: 'Finsense', data: user });
  // })
  // console.log(follows)
  var user ={
      username: req.session.username,
      profilePicture: req.session.profil_picture,
      id: req.session.id
  };
  res.render('success', { title: 'FinSense', user: user });

});

module.exports = router;
