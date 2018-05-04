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

const credentials = require('./credentials');
const invitedUsers = require('./invitedUsers');

console.log('creds', invitedUsers);

const app = express();
const httpServer = http.createServer(app);

app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var sessionOptions = {
  secret: credentials.session.secret,
  name: credentials.session.name,
  maxAge: 30 * 60 * 1000,  // expire token after 30 min.
  proxy: true,
  resave: true,
  saveUninitialized: true
};
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
	callbackURL: 	'/auth/google/callback',
	passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
	// console.log('user id', JSON.stringify(profile, null, 2));

	const user = {
		id: profile.id,
		email: profile.email,
		name: profile.displayName,
		bets: {
			7894: {team: 'team1', result: 'loss'},
			7895: {team: 'team1', result: 'win'}
		}
	}
	/*
	 * Create the user if they don't already exist.
	 */
	if(invitedUsers.indexOf(profile.email) !== -1) {
		if(!User.find(user)) {
			User.create(user);
		}
		console.log(User.users);
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

// if running locally, set up proxies from local config file:
var node_env = process.env.node_env || 'development';
if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
}

// Constants
const teams = {
	'KKR': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/400px-Kolkata_Knight_Riders_Logo.svg.png',
		form: [],
		points: 0,
	},
	'DD': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Delhi_Daredevils.svg/400px-Delhi_Daredevils.svg.png',
		form: [],
		points: 0,
	},
	'CSK': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/400px-Chennai_Super_Kings_Logo.svg.png',
		form: [],
		points: 0,
	},
	'MI': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/400px-Mumbai_Indians_Logo.svg.png',
		form: [],
		points: 0,
	},
	'RCB': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Royal_Challengers_Bangalore_Logo_2016.svg/400px-Royal_Challengers_Bangalore_Logo_2016.svg.png',
		form: [],
		points: 0,
	},
	'SRH': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Sunrisers_Hyderabad.svg/400px-Sunrisers_Hyderabad.svg.png',
		form: [],
		points: 0,
	},
	'RR': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/400px-Rajasthan_Royals_Logo.svg.png',
		form: [],
		points: 0,
	},
	'KXIP': {
		logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Kings_XI_Punjab_logo.svg/400px-Kings_XI_Punjab_logo.svg.png',
		form: [],
		points: 0,
	}
}

const matches = [];
const upcomingMatches = [];

/**************************************************************************************************/
// Don't touch anything above this line.
/**************************************************************************************************/

const start = () => {
	schedule.getSchedule(teams, matches, upcomingMatches);
}

start();

app.get('/finished-matches', (req, res) => {
	res.send(matches);
});

app.get('/upcoming-matches', (req, res) => {
	console.log(`Req from ${req.user.id}`);
	res.send(upcomingMatches);
});

app.get('/teams', (req, res) => {
	res.send(teams);
});

app.get('/me', (req, res) => {
	res.send(User.users[req.user.id]);
});

app.post('/bet', (req, res) => {
	console.log(`Bet from ${req.user.email} on match ${req.body.match} for ${req.body.bet}`);
	req.body.userId = req.user.id;
	User.addBet(req.body);
	console.log(User.users);
	res.send('Done.');
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
