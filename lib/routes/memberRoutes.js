const { Router } = require('express');
const Membership = require('../models/Membership');

module.exports = Router()
  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(member => res.send(member))
      .catch(next);
  });
