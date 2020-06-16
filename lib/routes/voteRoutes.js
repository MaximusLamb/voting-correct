const { Router } = require('express');
const Vote = require('../models/Vote');

module.exports = Router()
  .post('/', (req, res, next) => {
    Vote
      .create(req.body)
      .then(vote => res.send(vote))
      .catch(next);
  })
  .post('/vote', (req, res, next) => {
    Vote
      .findOneAndUpdate({ 
        poll: req.body.poll, user: req.body.user }, req.body, { new: true, upsert: true })
      .then(vote => res.send(vote))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Vote
      .find(req.query)
      .then(vote => res.send(vote))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(poll => res.send(poll))
      .catch(next);
  });
