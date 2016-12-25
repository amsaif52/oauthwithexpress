var express = require('express');
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	mongoose = require('mongoose'),
	logger = require('morgan'),
	passport = require('passport'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	path = require('path'),
	mongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var User = require('./models/user');
var app = express();

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, done);
});

var port = process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/bookworm-oauth");
var db = mongoose.connection;

db.on('error',console.error.bind(console,"connection error:"))

app.use(session({
	secret: 'random bookworm-oauth',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','pug');
app.set('views', path.join(__dirname + '/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.set('/static', express.static(path.join(__dirname+'/public')));
app.use('/', routes);

app.use(function(req,res,next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

if(app.get('env')=='development'){
	app.use(function(err,req,res,next){
		res.status(err.status || 500);
		res.render('error',{
			message: err.message,
			err: err
		});
	});
}

app.use(function(err,req,res,next){
		res.status(err.status || 500);
		res.render('error',{
			message: err.message,
			err: {}
		});
});

app.listen(port,function(){
	console.log("Listening on port: ",port);
});