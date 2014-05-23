#!/usr/bin/env node
/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// My own added
var http = require('http');
var config = require('./config')();
var MongoClient = require('mongodb').MongoClient;
var debug = require('debug')('app');

// TO be added later
/*
var Admin = require('./controllers/Admin'),
	Home = require('./controllers/Home'),
	Blog = require('./controllers/Blog'),
	Page = require('./controllers/Page');
*/

var routes = require('./routes/index');
var users = require('./routes/users');
var google = require('./routes/google');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// My own - Setting the port for the app
app.set('port', process.env.PORT || 3000);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('TutsWebsite'));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/google', google);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
/*
// General method to create a server
http.createServer(app).listen(config.port, function() {
    console.log(
        'Hopefully MongoDB server is running at ' + config.mongo.host + ':' + config.mongo.port,
        '\nExpress server listening on port ' + config.port
    );
});
*/

/*// My own - New method to create a server without considering a database
var server = app.listen(config.port, function() {
    var serverMessage = 'Express server for TutsWebsite is live on port ' + server.address().port;
    console.log(serverMessage);
    debug(serverMessage);
});
*/

var mongodbURL = 'mongodb://' + config.mongo.host + ':' + config.mongo.port;
MongoClient.connect(mongodbURL, function(error, db) {
   if(error) {
       console.log('Can\'t connect to database. :( ..... Exiting.')
   } else {
       var attachDB = function(req, res, next) {
           req.db = db;
           next();
       };
       var server = app.listen(config.port, function() {
           var serverMessage = 'Express server for TutsWebsite is live on port ' + server.address().port;
           console.log(serverMessage);
           debug(serverMessage);
       });
   }
});

module.exports = app;



/*MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db) {
	if(err) {
		console.log('Sorry, there is no mongo db server running.');
	} else {
		var attachDB = function(req, res, next) {
			req.db = db;
			next();
		};
		app.all('/admin*', attachDB, function(req, res, next) {
			Admin.run(req, res, next);
		});			
		app.all('/blog/:id', attachDB, function(req, res, next) {
			Blog.runArticle(req, res, next);
		});	
		app.all('/blog', attachDB, function(req, res, next) {
			Blog.run(req, res, next);
		});	
		app.all('/services', attachDB, function(req, res, next) {
			Page.run('services', req, res, next);
		});	
		app.all('/careers', attachDB, function(req, res, next) {
			Page.run('careers', req, res, next);
		});	
		app.all('/contacts', attachDB, function(req, res, next) {
			Page.run('contacts', req, res, next);
		});	
		app.all('/', attachDB, function(req, res, next) {
			Home.run(req, res, next);
		});		
		http.createServer(app).listen(config.port, function() {
		  	console.log(
		  		'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
		  		'\nExpress server listening on port ' + config.port
		  	);
		});
	}
});*/