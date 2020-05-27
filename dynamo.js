const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.REAL_ESTATE_WATCHER_AWS_REGION,
});

async function getById(propertyId) {
  let params = {
    TableName: process.env.REAL_ESTATE_WATCHER_DYNAMODB_TABLE_NAME,
    Key: { id: propertyId.toString() },
  };

  let result = await dynamo.get(params).promise();

  return result;
}

async function addById(propertyId) {
  let params = {
    TableName: process.env.REAL_ESTATE_WATCHER_DYNAMODB_TABLE_NAME,
    Item: { id: propertyId.toString() },
  };

  let result = await dynamo.put(params).promise();

  return result;
}

async function dothing() {
  // let result = await getById(2016237794);
  // let result = await addById(2016237794);
  // console.log(result);
}
dothing();

module.exports = {
  addById,
  getById,
};
