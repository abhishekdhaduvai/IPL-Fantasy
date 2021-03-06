const axios = require('axios');
const moment = require('moment-timezone');

const getSchedule = (matches, upcomingMatches) => {

  // if running locally, set up proxies from local config file:
  var node_env = process.env.node_env || 'development';
  if (node_env === 'development') {
    var devConfig = require('./localConfig.json')[node_env];
  }

  const api = devConfig ? devConfig.api : process.env.API;

  axios.get(api)
	.then(res => {
		/*
		 * TODO:
		 * Slicing the padding in the JSONP response for now.
		 * Try to do this more elegantly.
		 */
		data = res.data.slice(16,-2)
		data = JSON.parse(data);
		data.schedule.forEach(match => {
			let IST = moment.tz(match.matchDate, 'Asia/Kolkata');
			match.timeUTC = IST.utc().valueOf();
			// if(!match.matchStatus) {
			// 	/*
			// 	 * Convert IST to UTC time.
			// 	 * If current UTC time is less than the match date (in UTC), the match has already started
			// 	 * and it should not be displayed in the schedule.
			// 	 */
			// 	if(IST.utc() > (moment() + 60*60*1000))
			// 		upcomingMatches.push(match);
			// }
			// else {
			// 	matches.push(match);
			// }

			if(match.matchState === 'L' || match.matchState === 'C') {
				matches.push(match);
			}
			else {
				upcomingMatches.push(match);
			}
		});
	})
	.catch(err => {
		console.log(`Could not get matches at ${Date.now()}`, err);
	});
}

module.exports = {
  getSchedule
}