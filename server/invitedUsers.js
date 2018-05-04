const AWS = require('aws-sdk');
const credentials = require('./credentials');

AWS.config.update({
  accessKeyId: credentials.aws.accessKeyId,
  secretAccessKey: credentials.aws.secretAccessKey,
  region:'us-west-1'
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
	TableName: 'InvitedUsers',
	ReturnConsumedCapacity: 'TOTAL'
};

const invitedUsers = ['abhishek.dhaduvai1@gmail.com'];

// TODO: use DynamoDB to get invited users instead of hardcoding here.

// dynamodb.scan(params, (err, data)=>{
//   if(err) {
//     console.log('There was an error fetching data from DynamoDB');
//   }
//   else {
//     invitedUsers = data;
//   }
// });

module.exports = invitedUsers;