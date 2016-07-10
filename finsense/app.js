var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('instagram-node').instagram();
var routes = require('./routes/index');
var users = require('./routes/users');
var success = require('./routes/success');
var session = require('express-session')
var fs = require('fs'); 

var app = express();
//add client_id and client_secret here!
api.use({ client_id: process.env['CLIENT_ID'],
  client_secret: process.env['CLIENT_SECRET'] });

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, {scope: ['basic','public_content','follower_list'] }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      // res.send("Access Denied");
      res.redirect('/')
    } else {
      // console.log('Yay! Access token is ' + result.access_token);
      req.session.token = result.access_token;
      req.session.username = result.user.username;
      req.session.profil_picture = result.user.profile_picture;
      req.session.id = result.user.id;
      console.log(result);
      // console.log(req.session)
      // api.use({access_token: result.access_token});
      // api.user_follows(result.user.id, function(err, users, pagination, remaining, limit) {follows = users});
      // fs.writeFile('userInfo.txt', JSON.stringify(result))
      // fs.writeFile('access.txt', result.access_token + ', ' + result.user.id + ','+ result.user.username + '\n', function (err) {
        if (err) return console.log(err);
        // console.log(result.access_token + ' > access.txt');
        //console.log(res.param);
        // console.log(result);
        // api.user_follows(result.user.id, function(err, users, pagination, remaining, limit) {console.log(users)});
        // api.user_follows(result.user.id, function(err, users, pagination, remaining, limit) {
        //   // fs.writeFile('test.txt', JSON.stringify(users))
        //   for(var i=0; i<users.length;i++){
        //     fs.appendFile('access.txt', users[i].username + ","+ users[i].id + "\n", function(err){});
        //   }
        // });
        // res.send('Successful!');
        res.redirect('/success')
      };
  })
}


// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/handleauth', exports.handleauth);

app.get('/logout', function(req, res){
  req.session.destroy(function(err) { })
  res.redirect('/')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/success', success);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
