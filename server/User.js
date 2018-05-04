const users = {

}

const create = (user) => {
  users[user.id] = {};
  users[user.id].name = user.name;
  users[user.id].email = user.email;
  users[user.id].phone = user.phone;
  users[user.id].points = 0;
  users[user.id].bets = {};
  users[user.id].form = [];
}

const find = (user) => {
  return users[user.id];
}

const addBet = (bet) => {
  if(users[bet.userId].bets[bet.match] === bet.bet)
    users[bet.userId].bets[bet.match] = '';
  else
    users[bet.userId].bets[bet.match] = bet.bet;
}

module.exports = {
  create,
  find,
  addBet,
  users,
}