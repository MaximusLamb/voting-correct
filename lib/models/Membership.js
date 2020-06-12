const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

memberSchema.statics.deleteAllVotes = async function(id) {

  const Vote = this.model('Vote');

  const votes = await Vote.find({ membership: id });

  const deleteVotes = votes.map(vote => Vote.deleteAllMembersVotes(vote._id));

  return Promise.all([
    this.findByIdAndDelete(id),
    ...deleteVotes
  ])
    .then(([membership]) => membership);
};

module.exports = mongoose.model('Membership', memberSchema);
