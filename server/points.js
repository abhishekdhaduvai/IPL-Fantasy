const User = require('./User');

const calculatePoints = (matches) => {
  console.log('*************************************************************');
  console.log('Updating the points table');
  console.log('*************************************************************');
  matches.forEach(match => {
    if(match.matchState === 'C') {
      Object.keys(User.users).forEach(id => {

        if(User.users[id].bets[match.matchId.id]) {
          if(match.matchStatus.outcome === 'A') {
            if(User.users[id].bets[match.matchId.id].team === 'team1') {
              User.users[id].bets[match.matchId.id].result = 'win';
              User.users[id].points += 5;
              User.users[id].form.push('W');
              User.users[id].wins++;
            } else {
              User.users[id].bets[match.matchId.id].result = 'loss';
              User.users[id].points -= 3;
              User.users[id].form.push('L');
            }
          }
          else if(match.matchStatus.outcome === 'B') {
            if(User.users[id].bets[match.matchId.id].team === 'team2') {
              User.users[id].bets[match.matchId.id].result = 'win';
              User.users[id].points += 5;
              User.users[id].form.push('W');
              User.users[id].wins++;
            } else {
              User.users[id].bets[match.matchId.id].result = 'loss';
              User.users[id].points -= 3;
              User.users[id].form.push('L');
            }
          }
        }

      });
    }
  });
  return User.users;
}

module.exports = {
  calculatePoints
}