const { Router } = require('express');
const Membership = require('../models/Membership');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Membership
      .create(req.body)
      .then(member => res.send(member))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Membership
      .find(req.query)
      .populate('organization', {
        title: true,
        image: true
      })
      .populate('user', {
        name: true,
        email: true
      })
      .then(member => res.send(member))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Membership
      .deleteAllVotes(req.params.id)
      .then(member => res.send(member))
      .catch(next);
  });
