const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  options: [String],
});

pollSchema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'poll'
});

pollSchema.statics.deleteAllPollsAndVotes = function(id) {

  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ poll: id })
  ])
    .then(([poll]) => poll);
};

module.exports = mongoose.model('Poll', pollSchema);
