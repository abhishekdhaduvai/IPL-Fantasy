const AWS = require('aws-sdk');
const credentials = require('./credentials');

AWS.config.update({
  accessKeyId: credentials.aws.accessKeyId,
  secretAccessKey: credentials.aws.secretAccessKey,
  region:'us-west-1'
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const users = {};

const getUsers = () => {
  const params = {
    TableName: 'FantasyUsers',
    ReturnConsumedCapacity: 'TOTAL'
  };

  dynamodb.scan(params, (err, data) => {
    if(err) console.log(err);
    else {
      data.Items.forEach(item => {
        users[item.id.S] = {};
        users[item.id.S].id = item.id.S;
        users[item.id.S].email = item.email.S;
        users[item.id.S].name = item.name.S;
        users[item.id.S].points = Number(item.points.N);
        users[item.id.S].bets = {};
        users[item.id.S].form = [];

        // Temporary Object to break down DynamoDB item to JSOn
        let bets = item.bets.M;
        Object.keys(bets).forEach(key => {
          users[item.id.S].bets[key] = {};
          users[item.id.S].bets[key] = bets[key].M;
          users[item.id.S].bets[key].team = bets[key].M.team.S;
          try {
            users[item.id.S].bets[key].result = bets[key].M.result.S;
          } catch(e) {}
        });
      });
    }
  });
}

const updateUserDB = (userId) => {
  const params = {
    TableName: 'FantasyUsers',
    ReturnConsumedCapacity: 'TOTAL',
  };
  let Item = {
    id: {S: users[userId].id},
    email: {S: users[userId].email},
    name: {S: users[userId].name},
    points: {N: users[userId].points.toString()},
    bets: {M: {}}
  }

  Object.keys(users[userId].bets).forEach(key => {
    Item.bets.M[key] = {};
    Item.bets.M[key].M = {};
    Item.bets.M[key].M.team = {};
    Item.bets.M[key].M.team.S = users[userId].bets[key].team;
  });

  params.Item = Item;

  dynamodb.putItem(params, (err, data) => {
    if(err) console.log(err);
    else {
      console.log(data);
    }
  })
}

const reset = () => {
  Object.keys(users).forEach(id => {
    users[id].points = 0;
    users[id].form = [];
  })
}

const create = (user) => {
  users[user.id] = {};
  users[user.id].id = user.id;
  users[user.id].name = user.name || user.email;
  users[user.id].email = user.email;
  users[user.id].phone = user.phone;
  users[user.id].points = 0;
  users[user.id].bets = user.bets || {};
  users[user.id].form = [];
}

const findOrCreate = (user) => {
  if(users[user.id] === undefined) {
    create(user);
  }
}

const addBet = (bet) => {
  if(!users[bet.userId].bets[bet.match]) {
    users[bet.userId].bets[bet.match] = {};
    users[bet.userId].bets[bet.match].team = bet.bet;
  } else {
    if(users[bet.userId].bets[bet.match].team === bet.bet)
      users[bet.userId].bets[bet.match].team = '';
    else
      users[bet.userId].bets[bet.match].team = bet.bet;
  }

  // Update the DB on AWS
  updateUserDB(bet.userId);
}

getUsers();

module.exports = {
  create,
  findOrCreate,
  addBet,
  users,
  reset
}