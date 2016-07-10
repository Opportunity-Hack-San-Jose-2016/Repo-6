var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
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
  var user ={};
  console.log(req.session)
  res.render('success', { title: 'Finsense', data: user });

});

module.exports = router;
