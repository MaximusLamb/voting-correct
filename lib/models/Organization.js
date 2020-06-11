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

module.exports = mongoose.model('Organization', organizationSchema);
