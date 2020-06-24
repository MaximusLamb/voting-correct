const { Router } = require('express');
const Vote = require('../models/Vote');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Vote
      .create(req.body)
      .then(vote => res.send(vote))
      .catch(next);
  })
  .post('/vote', ensureAuth, (req, res, next) => {
    Vote
      .findOneAndUpdate({ 
        poll: req.body.poll, user: req.body.user }, req.body, { new: true, upsert: true })
      .then(vote => res.send(vote))
      .catch(next);
  })
  .get('/by-vote-amount', ensureAuth, (req, res, next) => {
    Vote
      .voteAmount()
      .then(vote => res.send(vote))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Vote
      .find(req.query)
      .then(vote => res.send(vote))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(poll => res.send(poll))
      .catch(next);
  });
