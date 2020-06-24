const voteAmount = [
  {
    '$project': {
      'option': '$option'
    }
  }, {
    '$group': {
      '_id': '$option', 
      'count': {
        '$sum': 1
      }
    }
  }
];

module.exports = {
  voteAmount
};
