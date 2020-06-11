const { Router } = require('express');
const Membership = require('../models/Membership');

module.exports = Router()
  .post('/', (req, res, next) => {
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
  });
