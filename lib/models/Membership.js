const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});

module.exports = mongoose.model('Membership', memberSchema);
