/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , hbs = require('hbs')
  , path = require('path');

var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
//var mongo = require('mongoskin');
//require('mongodb');
//var db = mongo.db("mongodb://localhost:27017/registration-1", {native_parser:true});  

var routes = require('./routes');
var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
//app.use(function(req,res,next){
//    req.db = db;
//    next();
//});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

