const users = {

}

const create = (user) => {
  users[user.id] = {};
  users[user.id].name = user.name;
  users[user.id].email = user.email;
  users[user.id].phone = user.phone;
  users[user.id].points = 0;
  users[user.id].bets = {};
}

const find = (user) => {
  return users[user.id];
}

module.exports = {
  create,
  find,
  users
}