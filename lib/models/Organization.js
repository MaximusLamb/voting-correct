const mongoose = require('mongoose');


const organizationSchema = new mongoose.Schema({

  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
  },
  image: {
    type: String
  }, 

}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

organizationSchema.virtual('polls', {
  ref: 'Poll',
  localField: '_id',
  foreignField: 'organization'
});

organizationSchema.statics.deleteAllPolls = async function(id) {

  const Poll = this.model('Poll');

  const polls = await Poll.find({ organization: id });

  const deletePolls = polls.map(poll => Poll.deleteAllPollsAndVotes(poll._id));

  return Promise.all([
    this.findByIdAndDelete(id),
    ...deletePolls
  ])
    .then(([organization]) => organization);
};

module.exports = mongoose.model('Organization', organizationSchema);
