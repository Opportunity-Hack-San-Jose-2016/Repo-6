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
var quiz = require('./routes/quiz');
var session = require('express-session')

require('dotenv').config();

var app = express();

api.use({ client_id: process.env['CLIENT_ID'],
  client_secret: process.env['CLIENT_SECRET'] });

app.use(session({
  secret: process.env['SECRET_KEY'],
  resave: false,
  saveUninitialized: true
}))

var redirect_uri = 'https://finsense.herokuapp.com/';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, {scope: ['basic','public_content','follower_list'] }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.redirect('/')
    } else {
      req.session.token = result.access_token;
      req.session.username = result.user.username;
      req.session.profil_picture = result.user.profile_picture;
      req.session.id = result.user.id;
      res.redirect('/success')
    };
  })
}

app.get('/authorize_user', exports.authorize_user);
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
app.use('/quiz', quiz);

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
