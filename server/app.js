const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // used for session cookie
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const axios = require('axios');
const moment = require('moment-timezone');

const User = require('./User');
const schedule = require('./schedule');
const points = require('./points');
const redisConfig = require('./redisConfig');
const credentials = require('./credentials');
var invitedUsers = require('./invitedUsers');

const app = express();
const httpServer = http.createServer(app);

// if running locally, set up proxies from local config file:
var node_env = process.env.node_env || 'development';
if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
}

app.set('trust proxy', 1);
app.enable("trust proxy");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var sessionOptions = {
  secret: credentials.session.secret,
	name: credentials.session.name,
	// expire token after 59 min. This is because bets can be changed 1hr before match start
  maxAge: 59 * 60 * 1000,
  proxy: true,
  resave: true,
  saveUninitialized: true
};
var redisCreds = redisConfig.getRedisCredentials();
if (redisCreds) {
  console.log('Using Redis for session store.');
  var RedisStore = require('connect-redis')(session);
  sessionOptions.store = new RedisStore({
    host: redisCreds.host,
    port: redisCreds.port,
    pass: redisCreds.password,
    ttl: 1800 // seconds = 30 min
  });
}
app.use(cookieParser(credentials.session.secret));
app.use(session(sessionOptions));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: credentials.google.clientId,
	clientSecret: credentials.google.secret,
	callbackURL: 	devConfig ? devConfig.callback : 'https://ipl-fantasy-app.run.aws-usw02-pr.ice.predix.io/auth/google/callback',
	passReqToCallback: true,
	proxy: true
},
function(request, accessToken, refreshToken, profile, done) {
	// console.log('user id', JSON.stringify(profile, null, 2));
	const user = {
		id: profile.id,
		email: profile.email,
		name: profile.displayName,
		bets: {}
	}
	/*
	 * Create the user if they don't already exist.
	 */
	if(invitedUsers.indexOf(profile.email) !== -1) {
		User.findOrCreate(user);
	}
	return done(null, user);
}
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/auth/google',
}));

const isAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		if(invitedUsers.indexOf(req.user.email) !== -1)
			next();
		else if(req.url === '/no-invitation/')
			next();
		else
			res.redirect('/no-invitation/');
	}
	else
		res.redirect('/auth/google');
}

//Use this route to make the entire app secure.  This forces login for any path in the entire app.
app.use('/',
	isAuthenticated,
	express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../'))
);

var matches = [];
var upcomingMatches = [];

/**************************************************************************************************/
// Don't touch anything above this line.
/**************************************************************************************************/

const start = () => {
	console.log('***************************************');
	console.log('Updating matches');
	console.log('***************************************');
	// var invitedUsers = require('./invitedUsers');
	matches = [];
	upcomingMatches = [];
	schedule.getSchedule(matches, upcomingMatches);
}

start();
setInterval(function() {
	start();
}, 15*60*1000);

app.get('/finished-matches', (req, res) => {
	res.send(matches);
});

app.get('/upcoming-matches', (req, res) => {
	res.send(upcomingMatches);
});

app.get('/table', (req, res) => {
	points.calculatePoints(matches);
	console.log(User.users);
	res.send(User.users);
	User.reset();
});

app.get('/teams', (req, res) => {
	res.send(teams);
});

app.get('/me', (req, res) => {
	res.send(User.users[req.user.id]);
});

app.post('/bet', (req, res) => {
	req.body.userId = req.user.id;
	User.addBet(req.body)
	res.send('Bet Updated');
});

app.get('/update-users', (req, res) => {
	invitedUsers = require('./invitedUsers');
	res.send('Users updated');
	console.log('*********--Users Updated--********');
	console.log(invitedUsers);
	console.log('**********************************');
});

app.use('/no-invitation/', function (req, res, next) {
	next();
}, function (req, res) {
	res.send('You are not invited to participate in this league. Contact: ');
});

////// error handlers //////
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
	app.use(function(err, req, res, next) {
		if (!res.headersSent) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

httpServer.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;
