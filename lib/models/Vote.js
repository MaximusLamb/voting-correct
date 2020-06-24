const mongoose = require('mongoose');
const { voteAmount } = require('../aggregations');

const voteSchema = new mongoose.Schema({

  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  option: {
    type: String,
    required: true
  }
});

voteSchema.statics.voteAmount = function(){
  return this.aggregate(voteAmount);
};

module.exports = mongoose.model('Vote', voteSchema);
