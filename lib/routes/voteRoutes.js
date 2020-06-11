const { Router } = require('express');
const Vote = require('../models/Vote');

module.exports = Router()
  .post('/', (req, res, next) => {
    Vote
      .create(req.body)
      .then(vote => res.send(vote))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Vote
      .find()
      .then(vote => res.send(vote))
      .catch(next);
  });
